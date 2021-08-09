#!/bin/bash
echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
if [ $? -ne 0 ]; then
  exit 1
fi

brew install libimobiledevice
if [ $? -ne 0 ]; then
  exit 1
fi
exit 0