function generateTAC() {
    const input = document.getElementById("expression").value.trim();
    const output = document.getElementById("output");

    if (input === "") {
        output.textContent = "Please enter an expression!";
        return;
    }

    try {
        const tokens = input.match(
            /[a-zA-Z_]\w*|\d+|[()+\-*/=]/g
        );

        if (!tokens || tokens.join("").replace(/\s/g, "") !== input.replace(/\s/g, "")) {
            throw new Error("Invalid expression!");
        }

        let pos = 0;
        let tempCount = 1;
        let code = [];

        function newTemp() {
            return "t" + tempCount++;
        }

        function primary() {
            if (tokens[pos] === "(") {
                pos++;
                let value = expression();

                if (tokens[pos] !== ")") {
                    throw new Error("Missing closing bracket!");
                }

                pos++;
                return value;
            }

            let token = tokens[pos];

            if (!token || !/^[a-zA-Z_]\w*$|^\d+$/.test(token)) {
                throw new Error("Invalid expression!");
            }

            pos++;
            return token;
        }

        function unary() {
            if (tokens[pos] === "-") {
                pos++;
                let value = unary();
                let temp = newTemp();
                code.push(temp + " = minus " + value);
                return temp;
            }

            return primary();
        }

        function term() {
            let left = unary();

            while (tokens[pos] === "*" || tokens[pos] === "/") {
                let op = tokens[pos++];
                let right = unary();
                let temp = newTemp();

                code.push(temp + " = " + left + " " + op + " " + right);
                left = temp;
            }

            return left;
        }

        function expression() {
            let left = term();

            while (tokens[pos] === "+" || tokens[pos] === "-") {
                let op = tokens[pos++];
                let right = term();
                let temp = newTemp();

                code.push(temp + " = " + left + " " + op + " " + right);
                left = temp;
            }

            return left;
        }

        let target = null;

        if (/^[a-zA-Z_]\w*$/.test(tokens[0]) && tokens[1] === "=") {
            target = tokens[0];
            pos = 2;
        }

        let result = expression();

        if (pos !== tokens.length) {
            throw new Error("Check your expression!");
        }

        if (target) {
            code.push(target + " = " + result);
        }

        output.textContent = code.join("\n") || "No code generated!";

    } catch (error) {
        output.textContent = "Error: " + error.message;
    }
}

function clearAll() {
    document.getElementById("expression").value = "";
    document.getElementById("output").textContent =
        "Your output will appear here.";
}
