'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    checkUser();
    fetchTournaments();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function fetchTournaments() {
    // Fetch ongoing tournaments (where started_at is not null and closed_at is null)
    const { data, error } = await supabase
      .from('tm.tourney')
      .select('id, name, guild_id, total_slots, started_at')
      .not('started_at', 'is', null)
      .is('closed_at', null)
      .limit(10);

    if (!error && data) {
      setTournaments(data);
    }
  }

  async function signInWithDiscord() {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  const metadata = user?.user_metadata || {};
  const avatarUrl = metadata.avatar_url || null;

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <a href="/" className={styles.logo}>🥔 Potato</a>
          <div className={styles.navLinks}>
            <a href="#home" className={styles.navLink}>Home</a>
            <a href="#tournaments" className={styles.navLink}>Tournaments</a>
          </div>
          {loading ? (
            <div className={styles.navLoader}></div>
          ) : user ? (
            <a href="/dashboard" className={styles.profileBtn}>
              <img src={avatarUrl} alt="Profile" className={styles.profileAvatar} />
              <span>Profile</span>
            </a>
          ) : (
            <button onClick={signInWithDiscord} className={styles.loginBtn}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Potato</h1>
          <p className={styles.heroSubtitle}>The Ultimate Esports Management Bot</p>
          <p className={styles.heroDescription}>
            Manage scrims, tournaments, and teams with ease. Built for competitive gaming communities.
          </p>
          <div className={styles.heroCta}>
            <a href="https://platform.genzconnect.pro" target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
              Visit Platform
            </a>
            {!user && (
              <button onClick={signInWithDiscord} className={styles.secondaryBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Login with Discord
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎮</div>
            <h3>Scrim Management</h3>
            <p>Automated registration, slot management, and slotlists</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <h3>Tournaments</h3>
            <p>Create and manage tournaments with ease</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Analytics</h3>
            <p>Track performance and statistics</p>
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section id="tournaments" className={styles.tournaments}>
        <h2 className={styles.sectionTitle}>🔴 Live Tournaments</h2>
        <p className={styles.sectionSubtitle}>Join ongoing tournaments and compete!</p>

        {tournaments.length > 0 ? (
          <div className={styles.tournamentGrid}>
            {tournaments.map((tourney) => (
              <div key={tourney.id} className={styles.tournamentCard}>
                <div className={styles.liveBadge}>
                  <span className={styles.liveDot}></span>
                  LIVE
                </div>
                <h3>{tourney.name}</h3>
                <p>Total Slots: {tourney.total_slots}</p>
                <a
                  href={`https://discord.com/channels/${tourney.guild_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.joinBtn}
                >
                  Click here to Join & Register →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noTournaments}>
            <p>No live tournaments right now</p>
            <span>Check back later for upcoming events!</span>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 Potato. Built for gamers, by gamers.</p>
        <a href="https://platform.genzconnect.pro" target="_blank" rel="noopener noreferrer">platform.genzconnect.pro</a>
      </footer>
    </div>
  );
}
