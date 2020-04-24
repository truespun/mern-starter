
import Comment from '../models/comment';
import sanitizeHtml from 'sanitize-html';


/**
 * Add a comment
 * @param req
 * @param res
 * @returns void
 */
export function addComment(req, res) {
  if (!req.body.comment.author || !req.body.comment.message || !req.params.cuid) {
    res.status(400).end();
  }

  const newComment = new Comment(req.body.comment);
  const postCuid = req.params.cuid;

  newComment.message = sanitizeHtml(newComment.message);
  newComment.author = sanitizeHtml(newComment.author);

  newComment.postCuid = postCuid;
  newComment.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ comment: saved });
  });
}

/**
 * Get comments per post
 * @param req
 * @param res
 * @returns void
 */
export function getCommentsPerPost(req, res) {
  Comment.find({ postCuid: req.params.cuid }).sort('-dateAdded').exec((err, comments) => {
    if (err) {
      res.status(500).send(err);
    }

    res.json({ comments });
  });
}

/**
 * Update a comment
 * @param req
 * @param res
 * @returns void
 */
export function updateComment(req, res) {
  Comment.findOneAndUpdate({ _id: req.params.id }, { message: req.body.comment.message }).exec((err, comment) => {
    if (err) {
      res.status(500).send(err);
    }

    res.json({ comment });
  });
}

/**
 * Delete a comment
 * @param req
 * @param res
 * @returns void
 */
export function deleteComment(req, res) {
  Comment.findOne({ _id: req.params.id }).exec((err, comment) => {
    if (err) {
      res.status(500).send(err);
    }

    comment.remove(() => {
      res.status(200).send({ comment }).end();
    });
  });
}
