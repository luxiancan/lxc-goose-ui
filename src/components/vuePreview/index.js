import previewComponent from './preview.vue'
let  PhotoSwipe= require('./libs/photoswipe');
let PhotoSwipeUI_Default = require( './libs/photoswipe-ui-default')
import Vue from 'vue';
let $preview
export default class vuePhotoPreview {
	constructor(props) {
		this.eventName=null
		this.eventCallback=null
		this.galleryPicLoading=false
		this.opts = props
		this.init();
	}
	init() {
        // 创建构造器
        let Profile = Vue.extend(previewComponent);
        // 创建 Profile 实例并挂载
		let preview_profile = new Profile({el: document.createElement('div')});
		document.body.appendChild(preview_profile.$el)
		$preview = preview_profile;
	}
	on(eventName, eventCallback) {
		this.eventCallback = eventCallback
		this.eventName = eventName
	}
	previewImage({current='',urls=[], imgIndex = 0}) {
		var clickedGallery = []
		var index = imgIndex;
		for(let i = 0 ;i < urls.length ; i++) {
			let vnode =  document.createElement('img')
			vnode.setAttribute('src', urls[i])
			clickedGallery.push(vnode)
			if(urls[i] === current && imgIndex === 0) {
				index = i;
			}
		}
		this.openPhotoSwipe(index, clickedGallery);
		// this.$emit('preview-open',current)
	}
	openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
			gallery,
			options,
			items;
		this.parseThumbnailElements(galleryElement)
		.then(items=> {

			options = {

				// galleryUID: galleryElement.getAttribute('data-pswp-uid'),	
				getThumbBoundsFn: function(index) {
					var thumbnail = items[index].el,
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
						rect = thumbnail.getBoundingClientRect();
					return {
						x: rect.left,
						y: rect.top + pageYScroll,
						w: rect.width
					};
					
				},

				addCaptionHTMLFn: function(item, captionEl, isFake) {
					if(!item.title) {
						captionEl.children[0].innerText = '';
						return false;
					}
					captionEl.children[0].innerHTML = item.title ;
					return true;
				},
				showHideOpacity:true,
				history:false,
				shareEl:false,
				maxSpreadZoom:3,
				getDoubleTapZoom:function(isMouseClick, item){
					if(isMouseClick) {
						
						return 1.5;
				
					} else {
						return item.initialZoomLevel < 0.7 ? 1 : 1.5;
					}
				}

			};

			if(fromURL) {
				if(options.galleryPIDs) {
					// parse real index when custom PIDs are used 
					// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
					for(var j = 0; j < items.length; j++) {
						if(items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			// exit if index not found
			if(isNaN(options.index)) {
				return;
			}
			options=this.extend(options,this.opts)

			if(disableAnimation) {
				options.showAnimationDuration = 0;
			}

			// Pass data to PhotoSwipe and initialize it
			gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
			// see: http://photoswipe.com/documentation/responsive-images.html
			var realViewportWidth,
				useLargeImages = false,
				firstResize = true,
				imageSrcWillChange;

			gallery.listen('beforeResize', function() {
				var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
				dpiRatio = Math.min(dpiRatio, 2.5);
				realViewportWidth = gallery.viewportSize.x * dpiRatio;

				if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
					if(!useLargeImages) {
						useLargeImages = true;
						imageSrcWillChange = true;
					}

				} else {
					if(useLargeImages) {
						useLargeImages = false;
						imageSrcWillChange = true;
					}
				}

				if(imageSrcWillChange && !firstResize) {
					gallery.invalidateCurrItems();
				}

				if(firstResize) {
					firstResize = false;
				}

				imageSrcWillChange = false;

			});

			gallery.listen('gettingData', function(index, item) {
				if(item.el.getAttribute('large')) {
					item.src = item.o.src;
					item.w = item.o.w;
					item.h = item.o.h;
				} else {
					item.src = item.m.src;
					item.w = item.m.w;
					item.h = item.m.h;
				}
			});
			gallery.listen('imageLoadComplete', (index, item)=> {
				this.galleryPicLoading=false
			});
			gallery.init();
			$preview.$el.classList=$preview.$el.classList+' pswp--zoom-allowed'
		})

	}
	
	parseThumbnailElements(thumbElements) {
		return new Promise(resolve=>{
			var items = [],
				el,
				load = 0,
				item;
				item = {}
			for(var i = 0; i < thumbElements.length; i++) {
				el = thumbElements[i];

				// include only element nodes 
				if(el.nodeType !== 1) {
					continue;
				}


				if(typeof el.naturalWidth == "undefined") {　　 // IE 6/7/8
					　　
					var i = new Image();　　
					i.src = el.src;　　
					var rw = i.width;　　
					var rh = i.height;
				} else {　　 // HTML5 browsers
					　　
					var rw = el.naturalWidth;　　
					var rh = el.naturalHeight;
				}
				getImage(i)
				var count=0
				function getImage(index){
					var l=new Image()
					l.src=el.getAttribute('large')?el.getAttribute('large'):el.getAttribute('src')
					l.text=el.getAttribute('preview-text')
					l.author=el.getAttribute('data-author')
					l.onload=function(){
						item = {
							title: l.text,
							el: thumbElements[index],
							src: l.src,
							w: rw,
							h: rh,
							author: l.author,
							o: {
								src: l.src,
								w: this.width,
								h: this.height,
							},
							m: {
								src: l.src,
								w: this.width,
								h: this.height,
							}
						};
						items[index]=item
						count++
						if(count==thumbElements.length){
							resolve(items)
						}
					}
				}
				

			}
		})
		
		return items

	}
	extend(o1, o2) {
		for (var prop in o2) {
			o1[prop] = o2[prop];
		}
		return o1
	}
}