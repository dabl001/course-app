const { Router } = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id,
        }).populate('user.userId');
        res.render('orders', {
            title: 'Orders',
            isOrder: true,
            orders: orders.map((o) => {
                const totalPrice = o.courses.reduce((total, c) => {
                    // Ensure valid numeric values for price and count
                    const coursePrice = c.course && c.course.price;
                    const count = c.count || 0;

                    return total + count * coursePrice;
                }, 0);

                return {
                    ...o._doc,
                    price: totalPrice,
                };
            }),
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId');

        const courses = user.cart.items.map((i) => ({
            count: i.count,
            course: { ...i.courseId._doc },
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses: courses,
        });
        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (err) {
        console.log(e);
    }
});

module.exports = router;
