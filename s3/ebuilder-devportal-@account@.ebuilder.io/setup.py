#!/usr/bin/python

import logging
import os
import sys
import subprocess

process = subprocess.Popen(['./deploymentBuild.sh'],
                stdout=subprocess.PIPE,
                shell=True);
(out, error) = process.communicate();

print out;
print error;
