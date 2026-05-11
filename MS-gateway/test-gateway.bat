@echo off
echo ========================================
echo Testing MS-Gateway
echo ========================================

echo.
echo 1. Testing Java compilation...
javac -cp "src\main\resources" src\main\java\com\fitlife\gateway\*.java

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Compilation failed
    pause
    exit /b
)

echo.
echo 2. Testing if we can run the application...
java -cp "src\main\resources" com.fitlife.gateway.MSGatewayApplication --help

echo.
echo ========================================
echo Test completed!
echo ========================================
pause
