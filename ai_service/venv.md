`venv` comes built-in with Python 3, so you don't need to install anything extra.

Here’s the 3-step way:

### *1. Create the virtual environment*
Go to your project folder in terminal/cmd, then run:

```bash
python -m venv venv
```

- `python` → use `python3` on Mac/Linux if needed
- `venv` → this is the folder name for the virtual environment. You can also use `.venv` to hide it

This makes a `venv/` folder with a separate Python + pip.

### *2. Activate it*

*Windows:*

```powershell
.\venv\Scripts\activate
```

*Mac / Linux:*

```bash
source venv/bin/activate
```

You’ll know it worked when you see `(venv)` in front of your terminal:

```text
(venv) user@pc:~/myproject$
```
### *3. Install packages & Deactivate*
Install stuff inside the env:

```bash
pip install package_name
```

When done:

```bash
deactivate
```
---

#### *Common extras*
Save what you installed:

```bash
pip freeze > requirements.txt
```

Recreate env later:

```bash
pip install -r requirements.txt
```

Use a specific Python version:

```bash
python3.11 -m venv venv
```
That’s all you need. 

Want me to also show you how to do this in VS Code / PyCharm?