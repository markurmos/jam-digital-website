#!/usr/bin/env python3
"""
Test script to verify MCP server functionality
"""

import sys
import subprocess
import importlib.util
import json
import os

def check_python_version():
    """Check if Python version is 3.10+"""
    version = sys.version_info
    if version.major == 3 and version.minor >= 10:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} is too old (need 3.10+)")
        return False

def check_mcp_installation():
    """Check if MCP is properly installed"""
    try:
        import mcp
        print(f"✅ MCP is installed (version: {getattr(mcp, '__version__', 'unknown')})")
        return True
    except ImportError:
        print("❌ MCP is not installed")
        print("   Run: pip install 'mcp[cli]'")
        return False

def check_server_file():
    """Check if the MCP server file exists and is valid"""
    server_path = "web/backend/mcp-servers/unified-stack-server.py"
    if not os.path.exists(server_path):
        print(f"❌ Server file not found: {server_path}")
        return False
    
    try:
        with open(server_path, 'r') as f:
            content = f.read()
            if 'from mcp.server import Server' in content:
                print(f"✅ Server file looks valid: {server_path}")
                return True
            else:
                print(f"⚠️  Server file exists but may be incomplete: {server_path}")
                return False
    except Exception as e:
        print(f"❌ Error reading server file: {e}")
        return False

def check_config_file():
    """Check if MCP configuration is valid"""
    config_path = "mcp-config.json"
    if not os.path.exists(config_path):
        print(f"❌ Config file not found: {config_path}")
        return False
    
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
            if 'servers' in config and 'unified-stack' in config['servers']:
                print(f"✅ Config file is valid: {config_path}")
                return True
            else:
                print(f"⚠️  Config file exists but may be incomplete: {config_path}")
                return False
    except json.JSONDecodeError as e:
        print(f"❌ Config file has invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Error reading config file: {e}")
        return False

def check_environment():
    """Check environment variables"""
    env_file = "web/.env.local"
    if not os.path.exists(env_file):
        print(f"⚠️  Environment file not found: {env_file}")
        return False
    
    required_vars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
        'ANTHROPIC_API_KEY'
    ]
    
    missing_vars = []
    placeholder_vars = []
    
    try:
        with open(env_file, 'r') as f:
            lines = f.readlines()
            
        env_vars = {}
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
        
        for var in required_vars:
            if var not in env_vars:
                missing_vars.append(var)
            elif env_vars[var].startswith('your_'):
                placeholder_vars.append(var)
        
        if missing_vars:
            print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        elif placeholder_vars:
            print(f"⚠️  Environment variables have placeholder values: {', '.join(placeholder_vars)}")
            print("   Update web/.env.local with your actual API keys")
        else:
            print("✅ Environment variables are configured")
            return True
            
    except Exception as e:
        print(f"❌ Error reading environment file: {e}")
    
    return len(missing_vars) == 0 and len(placeholder_vars) == 0

def test_server_syntax():
    """Test if the server file has valid Python syntax"""
    server_path = "web/backend/mcp-servers/unified-stack-server.py"
    try:
        with open(server_path, 'r') as f:
            code = f.read()
        
        compile(code, server_path, 'exec')
        print("✅ Server file has valid Python syntax")
        return True
    except SyntaxError as e:
        print(f"❌ Server file has syntax error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error checking server syntax: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 MCP Server Test Suite")
    print("========================")
    
    tests = [
        ("Python Version", check_python_version),
        ("MCP Installation", check_mcp_installation),
        ("Server File", check_server_file),
        ("Config File", check_config_file),
        ("Environment Variables", check_environment),
        ("Server Syntax", test_server_syntax),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        print(f"\n📋 Testing: {test_name}")
        results[test_name] = test_func()
    
    print("\n" + "="*50)
    print("📊 Test Results Summary")
    print("="*50)
    
    passed = 0
    total = len(tests)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\nScore: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your MCP server is ready to use.")
        print("\nNext steps:")
        print("1. Restart Claude Desktop")
        print("2. Try asking Claude to create a component or query your database")
        print("3. Your AI assistant now has full stack access!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix the issues above.")
        print("\nFor help, see:")
        print("- QUICK_MCP_SETUP.md")
        print("- web/docs/MCP_INTEGRATION.md")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)