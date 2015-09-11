#!/usr/bin/env sh
grunt t
grunt test_orig
grunt test_dist
grunt test_min
grunt
grunt test
npm test
