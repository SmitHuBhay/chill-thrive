const mongoose = require('mongoose');
const Service = require('./models/Service');
const Content = require('./models/Content');
const Feedback = require('./models/Feedback');

mongoose.connect('mongodb://127.0.0.1:27017/gwoc-portal')
    .then(() => console.log('✅ Connected to MongoDB for Seeding'))
    .catch(err => console.error(err));

const seedDB = async () => {
    console.log('🌱 Seeding...');
    
    // Clear existing data
    await Service.deleteMany({});
    await Content.deleteMany({});
    await Feedback.deleteMany({});

    // 1. SERVICES
    const services = [
        {
            title: "ICE BATH",
            category: "Recovery",
            price: 1500,
            duration: "3 mins",
            imageURL: "https://images.unsplash.com/photo-1579126031955-760848e9f545?auto=format&fit=crop&w=800&q=80",
            description: "Extreme cold therapy to reduce inflammation and boost recovery.",
            discountPercent: 10
        },
        {
            title: "Red Light Therapy",
            category: "Wellness",
            price: 1200,
            duration: "20 mins",
            imageURL: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
            description: "Deep tissue healing using infrared light technology.",
            discountPercent: 0
        },
        {
            title: "Compression Boots",
            category: "Recovery",
            price: 800,
            duration: "30 mins",
            imageURL: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
            description: "Pneumatic compression to improve blood flow and reduce soreness.",
            discountPercent: 5
        }
    ];

    // 2. BLOG POSTS
    const posts = [
        {
            title: "Benefits of Cold Exposure",
            body: "Cold exposure has been shown to improve immune system function, reduce inflammation, and increase metabolism...",
            imageURL: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&w=800&q=80",
            type: "Blog",
            tags: ["Health", "Cold Therapy"]
        },
        {
            title: "Why Recovery Matters",
            body: "Recovery is just as important as training. Without proper recovery, your muscles cannot grow and repair...",
            imageURL: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80",
            type: "Blog",
            tags: ["Fitness", "Wellness"]
        }
    ];

    // 3. FEEDBACK (REVIEWS) - Fixed: Added 'feedback' field
    const reviews = [
        {
            name: "Rahul Sharma",
            rating: 5,
            feedback: "Amazing experience! The cryo session really helped my knee pain.", // <--- THIS WAS MISSING
            isApproved: true
        },
        {
            name: "Priya Patel",
            rating: 4,
            feedback: "Great facility and friendly staff. Will come back again.", // <--- THIS WAS MISSING
            isApproved: true
        },
        {
            name: "Amit Verma",
            rating: 5,
            feedback: "Best recovery center in the city. Highly recommended!", // <--- THIS WAS MISSING
            isApproved: false // Pending approval
        }
    ];

    await Service.insertMany(services);
    await Content.insertMany(posts);
    await Feedback.insertMany(reviews);

    console.log('✅ Database Seeded Successfully!');
    mongoose.connection.close();
};

seedDB();