if __name__ == "__main__":
    print("Starting bot...", flush=True)
    import config
    from core import bot
    print("Imported bot, running...", flush=True)
    bot.run(config.DISCORD_TOKEN)
