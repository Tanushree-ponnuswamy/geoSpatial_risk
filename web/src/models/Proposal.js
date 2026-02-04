
import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    // Step 1: Land Details
    taluk: {
        type: String,
        required: [true, 'Taluk is required'],
    },
    town: {
        type: String,
        required: [true, 'Town is required'],
    },
    village: {
        type: String,
        required: [true, 'Village is required'],
    },
    surveyNo: {
        type: String,
        required: [true, 'Survey Number is required'],
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['Residential', 'Commercial', 'Institutional'],
        default: 'Residential',
    },
    floors: {
        type: String, // Keeping as string to match select "1", "2"
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },

    // Step 2: Owner Details
    ownerName: {
        type: String,
        required: [true, 'Owner Name is required'],
    },
    ownerContact: {
        type: String,
        required: [true, 'Contact Number is required'],
    },
    ownerAddress: {
        type: String,
        required: [true, 'Address is required'],
    },

    // Step 3: Documents
    ownershipProofUrl: { type: String },
    buildingPlanUrl: { type: String },
    idProofUrl: { type: String },
    applicantPhotoUrl: { type: String },

    // User Association
    submittedBy: {
        type: String, // Storing username for simplicity in this demo
        required: false
    },

    // Department Approvals
    departmentApprovals: {
        local_body: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        dtcp: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        revenue: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        forest: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        fire: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        pwd: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        horticulture: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        haca: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
        tnpcb: {
            status: { type: String, default: 'Pending' },
            remarks: { type: String, default: '' }
        },
    },

    // System Fields
    status: {
        type: String,
        default: 'Assessment Pending',
    },
    riskScore: {
        type: Number,
        default: null,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.models.Proposal || mongoose.model('Proposal', ProposalSchema);
