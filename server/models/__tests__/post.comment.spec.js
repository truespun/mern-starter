import test from 'ava';
import request from 'supertest';
import app from '../../server';
import Post from '../post';
import Comment from '../comment';
import { connectDB, dropDB } from '../../util/test-helpers';

// Initial posts and comments added into test db
const posts = [
  new Post({ name: 'Prashant', title: 'Hello Mern', slug: 'hello-mern', cuid: 'f34gb2bh24b24b2', content: "All cats meow 'mern!'" }),
  new Post({ name: 'Mayank', title: 'Hi Mern', slug: 'hi-mern', cuid: 'f34gb2bh24b24b3', content: "All dogs bark 'mern!'" }),
];

const comments = [
  new Comment({ author: 'Mr.Green', message: 'Nice post G!', postCuid: 'f34gb2bh24b24b2' }),
  new Comment({ author: 'Mr.Blue', message: 'Nice post! B', postCuid: 'f34gb2bh24b24b2' }),
  new Comment({ author: 'Mr.Red', message: 'Nice post R!', postCuid: 'f34gb2bh24b24b3' }),
  new Comment({ author: 'Mr.Yellow', message: 'Nice post Y!', postCuid: 'f34gb2bh24b24b3' }),
];
test.before('connect to mockgoose', async () => {
  await connectDB();
});

test.beforeEach('connect and add two post and four comment entries', async () => {
  await Post.create(posts).catch(() => 'Unable to create posts');
  await Comment.create(comments).catch(() => 'Unable to create comments');
});

test.afterEach.always(async () => {
  await dropDB();
});

test.serial('Should correctly give number of Comments per Post', async t => {
  t.plan(2);

  const res = await request(app)
    .get('/api/posts/f34gb2bh24b24b3/comments')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.deepEqual(comments.length, res.body.comments.length);
});

test.serial('Should send correctly update message of the comment', async t => {
  t.plan(2);

  const comment = new Comment({ author: 'Updater2000', message: 'Comment before update', postCuid: 'f34gb2bh24b24b2' });
  comment.save();

  const res = await request(app)
    .put(`/api/posts/f34gb2bh24b24b2/${comment._id}`)
    .send({ comment: { message: 'Comment after update' } })
    .set('Accept', 'application/json');
  const updatedComment = await Comment.findOne({ message: 'Comment after update' });
  t.is(res.status, 200);
  t.is(res.body.comment.message, updatedComment.message);
});

test.serial('Should correctly add a comments', async t => {
  t.plan(2);

  const res = await request(app)
    .post('/api/posts/f34gb2bh24b24b3/comments')
    .send({ comment: { author: 'Foo', message: 'bar' } })
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const savedComment = await Comment.findOne({ message: 'bar' }).exec();
  t.is(savedComment.author, 'Foo');
});

test.serial('Should not add a comments', async t => {
  t.plan(1);

  const res = await request(app)
    .post('/api/posts/f34gb2bh24b24b3/comments')
    .send({ comment: { author: 'Foo', message: 'bar' } })
    .set('Accept', 'application/json');

  t.is(res.status, 400);
});


test.serial('Should correctly delete a comment', async t => {
  t.plan(2);

  const comment = new Comment({ author: 'Dr.Green', message: 'Nice post DG!', postCuid: 'f34gb2bh24b24b2' });
  comment.save();

  const res = await request(app)
    .remove(`/api/posts/${comment.postCuid}/comments/${comment._id}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedComment = await Comment.findOne({ _id: comment._id }).exec();
  t.is(queriedComment, null);
});
