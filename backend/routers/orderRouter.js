import express from 'express';
import Order from '../models/Order.js'; 
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ message: "Access denied" });
    const { items, totalAmount, deliveryType } = req.body;
    if (!deliveryType) return res.status(400).json({ message: "Delivery type missing!" });

    const driverCut = 50; 
    const adminCut = Math.round((totalAmount - driverCut) * 0.10); 
    const vendorCut = (totalAmount - driverCut) - adminCut; 

    const newOrder = new Order({
      buyerId: req.user.id,
      items,
      totalAmount,
      deliveryType,
      status: 'Pending',
      paymentStatus: 'Paid',
      driverFee: driverCut,
      platformFee: adminCut,
      vendorEarnings: vendorCut
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ message: "Access denied" });
    const orders = await Order.find({ buyerId: req.user.id })
      .populate('driverId', 'name phone')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/vendor', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ message: "Access denied" });
    const orders = await Order.find({ 'items.vendorId': req.user.id })
      .populate('buyerId', 'name address phone')
      .populate('driverId', 'name') // <-- NEW: Grabs the driver's name for your report!
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/driver/active', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') return res.status(403).json({ message: "Access denied" });
    const orders = await Order.find({
     $or: [ { status: 'Pending' }, { driverId: req.user.id } ]
    })
    .populate('buyerId', 'name address phone')
    .populate('items.vendorId', 'businessName address phone')
    .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id/accept', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') return res.status(403).json({ message: "Access denied" });
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: 'Accepted', driverId: req.user.id }, 
      { new: true }
    )
    .populate('buyerId', 'name address phone')
    .populate('items.vendorId', 'businessName address phone');
    req.app.get('io').emit('orderStatusUpdated', order);
    res.status(200).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') return res.status(403).json({ message: "Access denied" });
    let updateData = { status: req.body.status };
    if (req.body.status === 'Delivered') updateData.paymentStatus = 'Settled';

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('buyerId', 'name address phone')
      .populate('items.vendorId', 'businessName address phone');
    req.app.get('io').emit('orderStatusUpdated', order);
    res.status(200).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/all', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Access denied" });
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT: Vendor updates order status (e.g., Packed, Prepped, Confirmed)
router.put('/:id/vendor-status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json({ message: "Access denied" });
    
    const { status } = req.body;
    const allowedStatuses = ['Confirmed', 'Packed', 'Prepped'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid vendor status update" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { returnDocument: 'after' } 
    ).populate('buyerId', 'name address phone');

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Emits the update to your live socket if you are using one
    if (req.app.get('io')) {
       req.app.get('io').emit('orderStatusUpdated', order);
    }
    
    res.status(200).json(order);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// 8. BUYER: Rate a Delivered Order
router.put('/:id/rate', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ message: "Access denied" });
    
    const { vendorRating, driverRating } = req.body;
    
    // Only allow ratings if the order is actually Delivered
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: 'Delivered', buyerId: req.user.id },
      { vendorRating, driverRating },
      { new: true }
    );

    if (!order) return res.status(400).json({ message: "Order not found or not delivered yet." });
    res.status(200).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;