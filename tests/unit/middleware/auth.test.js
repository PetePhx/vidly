const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const auth = require('../../../middleware/auth');
const _ = require('lodash');

describe('auth middleware', () => {
  it('should populate req.user with a valid JWT payload', () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };
    const token = (new User(user)).generateAuthToken();

    let req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});