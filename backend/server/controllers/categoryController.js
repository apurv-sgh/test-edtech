const Category = require('../models/Category');

const getTopCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isTop: true }).select('name slug description').sort({ name: 1 });
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).select('name slug description').sort({ name: 1 });
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug }).lean();
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        // Shape data for the domain details page; map samples to courses
        const details = {
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            courses: Array.isArray(category.samples) ? category.samples : [],
            videos: [
                { title: `${category.name} Basics`, channel: 'EdTech', thumb: 'https://placehold.co/600x400/2563eb/ffffff?text=Lesson+1' },
                { title: `${category.name} Advanced`, channel: 'EdTech', thumb: 'https://placehold.co/600x400/94a3b8/0f172a?text=Lesson+2' }
            ]
        };

        return res.status(200).json({ success: true, category: details });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch category', error: error.message });
    }
};

module.exports = {
    getTopCategories,
    getAllCategories,
    getCategoryBySlug
};


