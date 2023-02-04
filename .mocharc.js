const chai = require('chai');
chai.use(require('chai-exclude'));
chai.use(require('chai-as-promised'));
chai.use(require('deep-equal-in-any-order'));
chai.use(require('chai-http'));

require('ts-node/register/transpile-only');
require('dotenv').config({ path: './.env.test' });
