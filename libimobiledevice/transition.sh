#!/bin/bash
cmd=$1
install_name_tool -change /usr/local/opt/libusbmuxd/lib/libusbmuxd-2.0.6.dylib @executable_path/../libusbmuxd-2.0.6.dylib $cmd
install_name_tool -change /usr/local/opt/libplist/lib/libplist-2.0.3.dylib @executable_path/../libplist-2.0.3.dylib $cmd
install_name_tool -change /usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib @executable_path/../libssl.1.1.dylib $cmd
install_name_tool -change /usr/local/opt/openssl@1.1/lib/libcrypto.1.1.dylib @executable_path/../libcrypto.1.1.dylib $cmd
