"""
BondMCP Python SDK Setup

Setup script for the BondMCP Python SDK.
"""

from setuptools import setup, find_packages

setup(
    name="bondmcp",
    version="0.1.0",
    description="Healthcare-optimized Model Context Protocol (MCP) SDK",
    author="BondMCP",
    author_email="support@bondmcp.com",
    url="https://docs.bondmcp.com/sdks/python",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.0",
        "aiohttp>=3.7.4",
        "pydantic>=1.8.0",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    python_requires=">=3.7",
)
