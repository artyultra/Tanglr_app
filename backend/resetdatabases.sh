#!/bin/bash

# This script is used to reset the database for a new deployment.
# It is not intended to be run in production.
curl -X POST http://localhost:8082/v1/reset
