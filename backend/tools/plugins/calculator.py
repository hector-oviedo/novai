# tools/plugins/calculator.py
def calculate(expression: str) -> str:
    """
    Evaluate a simple math expression like '2 + 3'.
    VERY UNSAFE to use eval in real code—this is for demo only.
    """
    try:
        return str(eval(expression))
    except Exception:
        return "Error: invalid expression"
