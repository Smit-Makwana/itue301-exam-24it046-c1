const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// @desc    Book a ticket
// @route   POST /api/v1/tickets
// @access  Private
const bookTicket = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity) {
      return res.status(400).json({ message: 'eventId and quantity are required' });
    }

    // Check event availability
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableSeats < quantity) {
      return res.status(400).json({
        message: `Not enough seats available. Only ${event.availableSeats} seat(s) left.`,
      });
    }

    const totalPrice = event.price * quantity;

    // Create ticket
    const ticket = await Ticket.create({
      attendeeId: req.user._id,
      eventId,
      quantity,
      totalPrice,
    });

    // Update available seats
    await Event.findByIdAndUpdate(eventId, {
      $inc: { availableSeats: -quantity },
    });

    res.status(201).json(ticket);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my tickets
// @route   GET /api/v1/tickets/my
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ attendeeId: req.user._id })
      .populate('attendeeId', 'name email')
      .populate('eventId', 'title date venue price')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel a ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private
const cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.attendeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this ticket' });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({ message: 'Ticket already cancelled' });
    }

    // Restore available seats
    await Event.findByIdAndUpdate(ticket.eventId, {
      $inc: { availableSeats: ticket.quantity },
    });

    ticket.status = 'cancelled';
    await ticket.save();

    res.json({ message: 'Ticket cancelled successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { bookTicket, getMyTickets, cancelTicket };
