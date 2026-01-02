"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemSettings = exports.updateSystemSettings = exports.getAnalytics = exports.getSystemLogs = exports.deleteAssistant = exports.saveAssistant = exports.getAssistants = exports.cancelSubscription = exports.getSubscriptions = exports.deleteUser = exports.updateUser = exports.getUsers = exports.getDashboardStats = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const db = admin.firestore();
/**
 * Verify admin role
 */
const verifyAdmin = async (uid) => {
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    return (userData === null || userData === void 0 ? void 0 : userData.role) === 'admin';
};
/**
 * Get dashboard statistics
 */
exports.getDashboardStats = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    try {
        // Get user counts
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;
        // Get active users (logged in within last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsersSnapshot = await db
            .collection('users')
            .where('lastLoginAt', '>=', thirtyDaysAgo)
            .get();
        const activeUsers = activeUsersSnapshot.size;
        // Get subscription counts
        const proUsersSnapshot = await db
            .collection('users')
            .where('plan', '==', 'pro')
            .get();
        const proUsers = proUsersSnapshot.size;
        const businessUsersSnapshot = await db
            .collection('users')
            .where('plan', '==', 'business')
            .get();
        const businessUsers = businessUsersSnapshot.size;
        // Calculate revenue (simplified)
        const monthlyRevenue = (proUsers * 19.99) + (businessUsers * 49.99);
        // Get message counts for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Get recent signups
        const recentSignupsSnapshot = await db
            .collection('users')
            .orderBy('createdAt', 'desc')
            .limit(7)
            .get();
        const dailySignups = recentSignupsSnapshot.docs.map(doc => {
            var _a, _b, _c, _d;
            return ({
                date: ((_d = (_c = (_b = (_a = doc.data().createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.toISOString) === null || _d === void 0 ? void 0 : _d.call(_c)) || new Date().toISOString(),
                count: 1,
            });
        });
        return {
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                proUsers,
                businessUsers,
                monthlyRevenue,
                dailySignups,
            },
        };
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get dashboard stats');
    }
});
/**
 * Get all users with pagination
 */
exports.getUsers = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { limit = 20, startAfter, filter } = request.data;
    try {
        let query = db.collection('users').orderBy('createdAt', 'desc');
        if (filter === null || filter === void 0 ? void 0 : filter.plan) {
            query = query.where('plan', '==', filter.plan);
        }
        if (filter === null || filter === void 0 ? void 0 : filter.status) {
            query = query.where('status', '==', filter.status);
        }
        if (startAfter) {
            const startDoc = await db.collection('users').doc(startAfter).get();
            query = query.startAfter(startDoc);
        }
        query = query.limit(limit);
        const snapshot = await query.get();
        const users = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return {
            success: true,
            users,
            hasMore: users.length === limit,
        };
    }
    catch (error) {
        console.error('Get users error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get users');
    }
});
/**
 * Update user (admin)
 */
exports.updateUser = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { userId, updates } = request.data;
    if (!userId || !updates) {
        throw new https_1.HttpsError('invalid-argument', 'User ID and updates are required');
    }
    try {
        // Sanitize updates - only allow certain fields
        const allowedFields = ['plan', 'status', 'role', 'messageQuota', 'imageQuota'];
        const sanitizedUpdates = {};
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                sanitizedUpdates[field] = updates[field];
            }
        }
        sanitizedUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        sanitizedUpdates.updatedBy = request.auth.uid;
        await db.collection('users').doc(userId).update(sanitizedUpdates);
        // Log admin action
        await db.collection('adminLogs').add({
            action: 'updateUser',
            targetUserId: userId,
            changes: sanitizedUpdates,
            adminId: request.auth.uid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    }
    catch (error) {
        console.error('Update user error:', error);
        throw new https_1.HttpsError('internal', 'Failed to update user');
    }
});
/**
 * Delete user (admin)
 */
exports.deleteUser = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { userId } = request.data;
    if (!userId) {
        throw new https_1.HttpsError('invalid-argument', 'User ID is required');
    }
    try {
        // Delete user data from Firestore
        await db.collection('users').doc(userId).delete();
        // Delete user from Firebase Auth
        await admin.auth().deleteUser(userId);
        // Log admin action
        await db.collection('adminLogs').add({
            action: 'deleteUser',
            targetUserId: userId,
            adminId: request.auth.uid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    }
    catch (error) {
        console.error('Delete user error:', error);
        throw new https_1.HttpsError('internal', 'Failed to delete user');
    }
});
/**
 * Get all subscriptions
 */
exports.getSubscriptions = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { limit = 20, startAfter, status } = request.data;
    try {
        let query = db.collection('subscriptions').orderBy('createdAt', 'desc');
        if (status) {
            query = query.where('status', '==', status);
        }
        if (startAfter) {
            const startDoc = await db.collection('subscriptions').doc(startAfter).get();
            query = query.startAfter(startDoc);
        }
        query = query.limit(limit);
        const snapshot = await query.get();
        const subscriptions = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            // Get user info
            const userDoc = await db.collection('users').doc(data.userId).get();
            const userData = userDoc.data();
            return Object.assign(Object.assign({ id: doc.id }, data), { userEmail: userData === null || userData === void 0 ? void 0 : userData.email, userName: userData === null || userData === void 0 ? void 0 : userData.displayName });
        }));
        return {
            success: true,
            subscriptions,
            hasMore: subscriptions.length === limit,
        };
    }
    catch (error) {
        console.error('Get subscriptions error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get subscriptions');
    }
});
/**
 * Cancel subscription (admin)
 */
exports.cancelSubscription = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { subscriptionId, reason } = request.data;
    if (!subscriptionId) {
        throw new https_1.HttpsError('invalid-argument', 'Subscription ID is required');
    }
    try {
        const subDoc = await db.collection('subscriptions').doc(subscriptionId).get();
        const subData = subDoc.data();
        if (!subData) {
            throw new https_1.HttpsError('not-found', 'Subscription not found');
        }
        // Update subscription status
        await db.collection('subscriptions').doc(subscriptionId).update({
            status: 'cancelled',
            cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
            cancelReason: reason,
            cancelledBy: request.auth.uid,
        });
        // Update user plan to free
        await db.collection('users').doc(subData.userId).update({
            plan: 'free',
            messageQuota: 100,
            imageQuota: 10,
        });
        // Log admin action
        await db.collection('adminLogs').add({
            action: 'cancelSubscription',
            subscriptionId,
            userId: subData.userId,
            reason,
            adminId: request.auth.uid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    }
    catch (error) {
        console.error('Cancel subscription error:', error);
        throw new https_1.HttpsError('internal', 'Failed to cancel subscription');
    }
});
/**
 * Get AI assistants
 */
exports.getAssistants = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    try {
        const snapshot = await db.collection('assistants').orderBy('createdAt', 'desc').get();
        const assistants = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return {
            success: true,
            assistants,
        };
    }
    catch (error) {
        console.error('Get assistants error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get assistants');
    }
});
/**
 * Create or update AI assistant
 */
exports.saveAssistant = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { assistantId, data } = request.data;
    if (!data || !data.name || !data.systemPrompt) {
        throw new https_1.HttpsError('invalid-argument', 'Assistant name and system prompt are required');
    }
    try {
        const assistantData = {
            name: data.name,
            description: data.description || '',
            category: data.category || 'General',
            icon: data.icon || '🤖',
            systemPrompt: data.systemPrompt,
            model: data.model || 'gpt-4',
            isActive: data.isActive !== false,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: request.auth.uid,
        };
        if (assistantId) {
            // Update existing
            await db.collection('assistants').doc(assistantId).update(assistantData);
        }
        else {
            // Create new
            await db.collection('assistants').add(Object.assign(Object.assign({}, assistantData), { usageCount: 0, createdAt: admin.firestore.FieldValue.serverTimestamp(), createdBy: request.auth.uid }));
        }
        return { success: true };
    }
    catch (error) {
        console.error('Save assistant error:', error);
        throw new https_1.HttpsError('internal', 'Failed to save assistant');
    }
});
/**
 * Delete AI assistant
 */
exports.deleteAssistant = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { assistantId } = request.data;
    if (!assistantId) {
        throw new https_1.HttpsError('invalid-argument', 'Assistant ID is required');
    }
    try {
        await db.collection('assistants').doc(assistantId).delete();
        // Log admin action
        await db.collection('adminLogs').add({
            action: 'deleteAssistant',
            assistantId,
            adminId: request.auth.uid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    }
    catch (error) {
        console.error('Delete assistant error:', error);
        throw new https_1.HttpsError('internal', 'Failed to delete assistant');
    }
});
/**
 * Get system logs
 */
exports.getSystemLogs = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { limit = 100, level, service } = request.data;
    try {
        let query = db.collection('systemLogs').orderBy('timestamp', 'desc');
        if (level) {
            query = query.where('level', '==', level);
        }
        if (service) {
            query = query.where('service', '==', service);
        }
        query = query.limit(limit);
        const snapshot = await query.get();
        const logs = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return {
            success: true,
            logs,
        };
    }
    catch (error) {
        console.error('Get system logs error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get system logs');
    }
});
/**
 * Get analytics data
 */
exports.getAnalytics = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { dateRange = '7d' } = request.data;
    try {
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        switch (dateRange) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }
        // Get usage stats from analytics collection
        const analyticsSnapshot = await db
            .collection('analytics')
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .orderBy('date', 'asc')
            .get();
        const dailyStats = analyticsSnapshot.docs.map(doc => doc.data());
        // Aggregate totals
        const totals = dailyStats.reduce((acc, day) => ({
            messages: acc.messages + (day.messages || 0),
            images: acc.images + (day.images || 0),
            users: acc.users + (day.activeUsers || 0),
        }), { messages: 0, images: 0, users: 0 });
        return {
            success: true,
            analytics: {
                dailyStats,
                totals,
                dateRange,
            },
        };
    }
    catch (error) {
        console.error('Get analytics error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get analytics');
    }
});
/**
 * Update system settings
 */
exports.updateSystemSettings = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    const { settings } = request.data;
    if (!settings) {
        throw new https_1.HttpsError('invalid-argument', 'Settings object is required');
    }
    try {
        await db.collection('config').doc('system').set(Object.assign(Object.assign({}, settings), { updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: request.auth.uid }), { merge: true });
        // Log admin action
        await db.collection('adminLogs').add({
            action: 'updateSystemSettings',
            changes: Object.keys(settings),
            adminId: request.auth.uid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    }
    catch (error) {
        console.error('Update system settings error:', error);
        throw new https_1.HttpsError('internal', 'Failed to update system settings');
    }
});
/**
 * Get system settings
 */
exports.getSystemSettings = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const isAdmin = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
    try {
        const settingsDoc = await db.collection('config').doc('system').get();
        return {
            success: true,
            settings: settingsDoc.exists ? settingsDoc.data() : {},
        };
    }
    catch (error) {
        console.error('Get system settings error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get system settings');
    }
});
//# sourceMappingURL=admin.js.map