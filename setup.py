#!/usr/bin/python

import logging
import os
import sys
from golem.build_utils import build_gradle, get_arguments

args = get_arguments()

logging.basicConfig(level='DEBUG');
logger = logging.getLogger('setup')

env_vars = {
  "cco-dev" : {
    "eu-west-1": {
      "CUSTOM_DOMAIN_NAME": "apigw.ebuilder.io",
      "LOGLEVEL": "DEBUG",
      "ENVIRONMENT": "development"
      }
  },

  "cco-dev-test" : {
    "ap-northeast-1": {
      "CUSTOM_DOMAIN_NAME": "api-test-ap-northeast-1.ebuilder.io",
      "LOGLEVEL": "DEBUG",
      "ENVIRONMENT": "test"
    },
    "eu-west-1": {
      "CUSTOM_DOMAIN_NAME": "apigw-test.ebuilder.io",
      "LOGLEVEL": "DEBUG",
      "ENVIRONMENT": "test"
    }
  },
    
  "cco-prod-eu-west" : {
    "eu-west-1": {
      "CUSTOM_DOMAIN_NAME": "apigw-skutt.ebuilder.io",
      "LOGLEVEL": "INFO",
      "ENVIRONMENT": "production"
    }
  }
}

if len(sys.argv) != 2:
  logger.error('Required: A single argument with a base64-encoded dictionary with system information.')
  sys.exit(1)

if args['account'] not in env_vars:
  print 'No configuration data for the account "%s" is configured.'%args['account']
  sys.exit(1)

if args['region'] not in env_vars[args['account']]:
  print 'No configuration data for the region "%s" is configured for this account.'%args['region']
  sys.exit(1)

for key in env_vars[args['account']][args['region']]:
  print ':ENVIRONMENT:%s:%s:'%(
    key, env_vars[args['account']][args['region']][key])
