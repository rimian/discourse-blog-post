import TopicView from 'discourse/views/topic';
import PostView from 'discourse/views/post'
import CloakedView from 'discourse/views/cloaked';
import TopicModel from 'discourse/models/topic';
import TopicController from 'discourse/controllers/topic';
import TopicProgressView from 'discourse/views/topic-progress';
import TopicProgressController from 'discourse/controllers/topic-progress';

function helloFrom(location) {
  console.log('Hello from ', location);
}

export default {
  name: 'extend-for-blog-post',

  initialize() {
    TopicModel.reopen({});

    // Controllers maintain state based on the current route. In general, models
    // have properties that are saved to the server, controllers have properties that
    // do not need to be saved.
    //TopicController.reopen({
    //  blogCategory: function () {
    //    return this.siteSettings.blog_post_category;
    //  }.property(),
    //
    //  blogCategoryClass: function () {
    //    return this.get('blogCategory').replace(/ /g, '-');
    //  }.property('blogCategory'),
    //
    //  isBlog: function () {
    //    const currentCategory = this.get('model.category.fullSlug');
    //    return this.get('blogCategoryClass') === currentCategory;
    //  }.property('model.category.fullSlug'),
    //
    //  postDate: function () {
    //    return new Date(this.get('model.created_at')).toLocaleDateString();
    //  }.property('model.created_at'),
    //
    //  firstPoster: function () {
    //    const postStream = this.get('model.postStream');
    //    if (!postStream) { return; }
    //    return postStream.get('posts')[0].username;
    //  }.property('model.postStream'),
    //
    //  firstPost: function () {
    //    const postStream = this.get('model.postStream');
    //    if ( !postStream ) { return; }
    //    if ( !postStream.get('posts')[0]) { return; }
    //
    //    return postStream.get('posts')[0].cooked;
    //  }.property('model.postStream'),
    //
    //  bgImgURLs: function () {
    //    const firstPost = this.get('firstPost');
    //    if (!firstPost) { return; }
    //    let $firstPost = $($.parseHTML(firstPost));
    //    return $firstPost.find('.header-image');
    //  }.property('firstPost'),
    //
    //  hasBgImg: function () {
    //    const bgImgURLs = this.get('bgImgURLs');
    //    if (!bgImgURLs) { return; }
    //    return bgImgURLs.length;
    //  }.property('bgImgURLs'),
    //
    //});

    TopicController.reopen({

      blogCategory: function () {
        return this.siteSettings.blog_post_category;
      }.property(),

      blogCategoryClass: function () {
        return this.get('blogCategory').replace(/ /g, '-');
      }.property('blogCategory'),

      isBlog: function () {
        const currentCategory = this.get('model.category.fullSlug');
        return this.get('blogCategoryClass') === currentCategory;
      }.property('model.category.fullSlug'),

      postDate: function () {
        return new Date(this.get('model.created_at')).toLocaleDateString();
      }.property('model.created_at'),

      firstPoster: function () {
        const postStream = this.get('model.postStream');
        if (!postStream) {
          return;
        }
        return postStream.get('posts')[0].username;
      }.property('model.postStream'),

      firstPost: function () {
        const postStream = this.get('model.postStream');
        if (!postStream) {
          return;
        }
        if (!postStream.get('posts')[0]) {
          return;
        }

        return postStream.get('posts')[0].cooked;
      }.property('model.postStream'),

      //bgImgURLs: function () {
      //  const firstPost = this.get('firstPost');
      //  if (!firstPost) { return; }
      //  let $firstPost = $($.parseHTML(firstPost));
      //  return $firstPost.find('.header-image');
      //}.property('firstPost'),
      //
      //hasBgImg: function () {
      //  const bgImgURLs = this.get('bgImgURLs');
      //  if (!bgImgURLs) { return; }
      //  return bgImgURLs.length;
      //}.property('bgImgURLs'),

      cooked: function () {
        const posts = this.get('model.postStream.posts');
        if (!posts) {
          return;
        }
        return posts[0].get('cooked');
      }.property('model.postStream.posts'),

      bgImages: function () {
        const cooked = this.get('cooked');
        if (!cooked) {
          return;
        }
        let $cooked = $($.parseHTML(cooked));
        return $cooked.find('.header-image');
      }.property('cooked'),

      hasBgImg: function () {
        const bgImages = this.get('bgImages');
        return bgImages.length;
      }.property('bgImages'),

    });

    TopicView.reopen({});

    PostView.reopen({
      //firstPost: Em.computed.alias('controller.firstPost'),
      blogCategory: Em.computed.alias('controller.blogCategory'),
      blogCategoryClass: Em.computed.alias('controller.blogCategoryClass'),
      isBlog: Em.computed.alias('controller.isBlog'),
      //bgImgURLs: Em.computed.alias('controller.bgImgURLs'),
      hasBgImg: Em.computed.alias('controller.hasBgImg'),
      postDate: Em.computed.alias('controller.postDate'),
      firstPoster: Em.computed.alias('controller.firstPoster'),
      cooked: Em.computed.alias('controller.cooked'),
      bgImages: Em.computed.alias('controller.bgImages'),


      _addBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').addClass('blog-post');
        }
      },

      didInsertElement: function () {
        console.log("POST VIEW")
        this._addBlogBodyClass();
        let bgImages = this.get('bgImages');
        if (bgImages) {
          let $firstImage = $(bgImages[0]),
            imageUrl = $firstImage.attr('src'),
            imageWidth = $firstImage.attr('width'),
            imageHeight = $firstImage.attr('height'),
            imageRatio = imageHeight / imageWidth,
            imageMaxHeight = 472,
            imageComputedHeight = imageMaxHeight > imageWidth * imageRatio ? imageMaxHeight : imageWidth * imageRatio;

          $('.bg-container').css({
            'height': imageComputedHeight + 'px',
            'background-image': 'url(' + imageUrl + ')',
            'background-repeat': 'no-repeat',
            'background-size': '100% auto'
          });

          $('.large-title').css({
            'padding-top': imageComputedHeight + 'px'
          });
        }
      },

      removeBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').removeClass('blog-post');
        }
      }.on('willDestroyElement'),


    });
  }
}
