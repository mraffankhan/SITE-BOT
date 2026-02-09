'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './dashboard.module.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    async function loadUserData() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = '/';
            return;
        }

        setUser(user);

        const discordId = user.user_metadata?.provider_id || user.id;

        const { data: userData, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', discordId)
            .single();

        if (!error && userData) {
            setDbUser(userData);
        }

        setLoading(false);
    }

    async function signOut() {
        await supabase.auth.signOut();
        window.location.href = '/';
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loader}></div>
            </div>
        );
    }

    if (!user) return null;

    const metadata = user.user_metadata || {};
    const avatarUrl = metadata.avatar_url || `https://cdn.discordapp.com/embed/avatars/0.png`;
    const username = metadata.full_name || metadata.name || 'User';

    return (
        <div className={styles.page}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    <a href="/" className={styles.logo}>🥔 Potato</a>
                    <div className={styles.navLinks}>
                        <a href="/" className={styles.navLink}>Home</a>
                        <a href="/#tournaments" className={styles.navLink}>Tournaments</a>
                    </div>
                    <a href="/" className={styles.backBtn}>← Back to Home</a>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className={styles.container}>
                <div className={styles.glow}></div>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
                        <div className={styles.userInfo}>
                            <h1 className={styles.username}>{username}</h1>
                            <span className={styles.discordId}>ID: {metadata.provider_id || user.id}</span>
                        </div>
                        <button onClick={signOut} className={styles.logoutBtn}>Logout</button>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Account Details</h2>
                        <div className={styles.grid}>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>Email</span>
                                <span className={styles.statValue}>{user.email || 'Not set'}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>Status</span>
                                <span className={`${styles.statValue} ${dbUser?.is_premium ? styles.premium : ''}`}>
                                    {dbUser?.is_premium ? '⭐ Premium' : 'Free'}
                                </span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>Joined</span>
                                <span className={styles.statValue}>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>Potato Coins</span>
                                <span className={styles.statValue}>{dbUser?.money || 0} 💰</span>
                            </div>
                        </div>
                    </div>

                    {dbUser && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Bot Stats</h2>
                            <div className={styles.grid}>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>Total Votes</span>
                                    <span className={styles.statValue}>{dbUser.total_votes || 0}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
