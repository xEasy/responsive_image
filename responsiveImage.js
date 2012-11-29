/*!
 * Responsive Images: Mobile-First images that scale responsively and responsibly
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Usage
 * 1.pleace holder for image
 *    set data-src for real src
 *    example: <img src='/iamges/loading.gig' data-src='/images/real-img.jpg'>
 * 2.retina & big size need
 *    config size mapper to loading/can't config now
*/
(function( win ){
	//defaults / mixins
	var	rwdi = win.rwd_images || {},
      widthBreakPoint	= rwdi.widthBreakPoint || 360,
      htmlClass = "imgs-lrg",
      wideload = win.innerWidth > widthBreakPoint,
      retinaload = win.devicePixelRatio > 1,
      doc	= win.document,
      date = new Date();

  date.setTime(date.getTime()+(5/*5 sec*/*1000));
  doc.cookie = "rwd-resolution=" + screen.width + ";expires=" + date.toGMTString() +"; path=/";

  //if wideload is false quit now
  //if( !wideload ){ return; }

  //add HTML class
  doc.documentElement.classList.add(htmlClass);

  //find and replace img elements
  var resizeExtVersionMapper = function(version){
    if (version == undefined) { return "" };
    var mapper = {
      small: '-medium',
      medium: '-big',
      big: '',
      mtsmall: '-tsmall',
      tsmall: '-tbig',
      mbsmall: '-mbbig'
    }
    return mapper[version] || version
  }

  findrepsrc = function(){
    for( var i = 0, imgs = doc.getElementsByTagName( "img" ), il = imgs.length; i < il; i++){
      var newSrc,
          image	= imgs[i],
          needwided = (image.getAttribute('data-full') == 'y' && wideload),
          dataSrc	= image.getAttribute('data-src'),
          sourceSrc	= image.getAttribute('src'),
          loaded  = image.getAttribute('loaded') == 'y';

      if (!loaded){
        if (needwided || retinaload) {
          newSrc = gotWideImageUrl(dataSrc || sourceSrc)
        }else{
          newSrc = dataSrc;
        }
        replaceImage(image, newSrc);
      }
    }
  }

  gotWideImageUrl = function(url){
    var urlInfo = url.split('.'),
        extension = urlInfo.pop(),
        exts  = extension.split('-'), // jpg-small
        extType = exts[0],
        extVersion = exts[1];
    urlInfo.push(extType + resizeExtVersionMapper(extVersion));
    return urlInfo.join('.');
  }

  replaceImage = function(image, newSrc){
    var tmpImage = new Image();
    tmpImage.onload = function(){
      image.src = newSrc;
      image.setAttribute('loaded', 'y');
    }
    tmpImage.src = newSrc;
  }

  //flag for whether loop has run already
  complete = false;

  //remove base if present, find/rep image srcs if wide enough (maybe make this happen at domready?)
  window.readyCallbackImage	= function(force){
    if (force == true) { complete = false}
    if( complete){ return; }
    complete = true;
    findrepsrc();
  };

	//DOM-ready or onload handler
	//W3C event model
	win.addEventListener( "load", window.readyCallbackImage, false );
})(this);

