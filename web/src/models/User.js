import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'super_admin', 'local_body', 'dtcp', 'revenue', 'forest', 'fire', 'pwd', 'horticulture', 'haca', 'tnpcb'],
        default: 'user',
    },
    department: {
        type: String,
        required: false, // Only for dept admins
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
