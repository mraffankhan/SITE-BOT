"""Quick test script to debug database connection"""
import asyncio
import ssl

# Create SSL context
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

async def test_connection():
    import asyncpg
    
    print("Attempting to connect to database...")
    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(
                host="db.pzsvbqfzacidkeqavgfh.supabase.co",
                port=5432,
                user="postgres",
                password="affan@805032",
                database="postgres",
                ssl=ctx
            ),
            timeout=10.0
        )
        print("✓ Connection successful!")
        await conn.close()
    except asyncio.TimeoutError:
        print("✗ Connection timed out after 10 seconds")
    except Exception as e:
        print(f"✗ Connection failed: {type(e).__name__}: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
