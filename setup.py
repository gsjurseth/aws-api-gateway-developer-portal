#!/usr/bin/python

import logging
import os
import sys

logging.basicConfig(level='DEBUG');
logger = logging.getLogger('setup')

env_vars = {
  "cco-dev" : {
    "CUSTOM_DOMAIN_NAME": "apigw.ebuilder.io",
    "LOGLEVEL": "DEBUG"
  },

  "cco-dev-test" : {
    "CUSTOM_DOMAIN_NAME": "apigw-test.ebuilder.io",
    "LOGLEVEL": "DEBUG"
  },
  "cco-prod-eu-west" : {
    "CUSTOM_DOMAIN_NAME": "apigw-skutt.ebuilder.io",
    "LOGLEVEL": "INFO"
  }
}

if ( (len(sys.argv) != 3) or not (sys.argv[1] in env_vars.keys()) ):
  logger.error("The first argument must be an account name from this list: " + ",".join(env_vars.keys()) )
  sys.exit(1)
#endIf

account = sys.argv[1]

# not used at this point but this is how we'd grab the stage name as well
stage = sys.argv[2]

for key in env_vars[account]:
  print ':ENVIRONMENT:%s:%s:'%(key, env_vars[account][key])
