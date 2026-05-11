@echo off
echo ========================================
echo Starting MS-Gateway
echo ========================================

echo.
echo 1. Compiling MS-Gateway...
javac -cp "target\classes;target\dependency\*" src\main\java\com\fitlife\gateway\*.java

echo.
echo 2. Starting MS-Gateway on port 8080...
java -jar target\ms-gateway-1.0.0.jar

echo.
echo ========================================
echo MS-Gateway started!
echo Access: http://localhost:8080
echo ========================================

pause
