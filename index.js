<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Age Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            text-align: center;
            width: 300px;
        }
        input, button {
            padding: 12px;
            margin: 10px 0;
            width: 90%;
            font-size: 16px;
            border-radius: 8px;
            border: 1px solid #ccc;
        }
        button {
            background: #667eea;
            color: white;
            cursor: pointer;
            border: none;
            font-weight: bold;
        }
        button:hover {
            background: #764ba2;
        }
        #result {
            margin-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>🎂 Age Calculator</h2>
        <input type="date" id="dateOfBirth">
        <br>
        <button onclick="findAge()">Calculate Age</button>
        <p id="result"></p>
    </div>

    <script>
    function findAge() {
        const dateInput = document.getElementById("dateOfBirth").value;
        const result = document.getElementById("result");

        if (dateInput === "") {
            result.textContent = "Please enter your date of birth.";
            return;
        }

        const birthDate = new Date(dateInput);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        result.textContent = `You are ${years} years, ${months} months, and ${days} days old. 🎉`;
    }
    </script>
</body>
</html>
