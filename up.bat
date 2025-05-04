@echo off
git pull
git add --all
git status | findstr /C:"nothing to commit" > nul
if %ERRORLEVEL% EQU 0 (
  echo No changes to commit.
) else (
  git commit -m "Auto-commit: %date% %time%"
  git push
)
pause