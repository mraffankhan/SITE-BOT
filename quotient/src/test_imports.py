"""Diagnostic script to find which import hangs"""
import sys
print("1. Starting imports...", flush=True)

print("2. Importing asyncio...", flush=True)
import asyncio

print("3. Importing discord...", flush=True)
import discord

print("4. Importing tortoise...", flush=True)
from tortoise import Tortoise

print("5. Importing config...", flush=True)
import config

print("6. Importing constants...", flush=True)
import constants

print("7. Importing models...", flush=True)
from models import Guild, Timer

print("8. All imports successful!", flush=True)
