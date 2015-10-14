(function(){
	$.fn['dropUpload'] = function(options){
		$this = $(this);
		var plugin = {};
		plugin.settings = {
			showFileList : true,
			showFileListContainer : '',
			showUploadProgress : true,
			progressBarContainer : '',
			uploadStatus: {
				uploadProgress: {
					text: 'Uploading',
					className: 'progress-bar-success',
					icon: '<i class="fa fa-cloud-upload"></i>'
				},
				uploadSuccess: {
					text: 'Upload Successful',
					className: 'progress-bar-success',
					icon: '<i class="fa fa-check"></i>'
				},
				uploadFail: {
					text: 'Upload Failed',
					className: 'progress-bar-danger',
					icon: '<i class="fa fa-times"></i>'
				},

			}
		};

		$.extend(plugin.settings, options);

		plugin.init = function(){
			$this.on('dragover', plugin.onDragover);
			$this.on('dragleave', plugin.onDragleave);
			$this.on('drop', plugin.onDrop);

			if(plugin.settings.showUploadProgress){
				$this.after('<div id="upload-progress" />');
			}
		};

		plugin.onDragover = function(e){
			e.stopPropagation();
			e.preventDefault();
			$this.addClass('drop-over');
		    e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		};
		plugin.onDragleave = function(e){
			e.stopPropagation();
			e.preventDefault();
			$this.removeClass('drop-over');
		};
		plugin.onDrop = function(e){
			if(plugin.settings.showUploadProgress){
				$("#upload-progress").empty();
			}
			e.stopPropagation();
			e.preventDefault();
		    var files = e.originalEvent.dataTransfer.files; // FileList object.
		    // files is a FileList of File objects. List some properties.		    
		    $this.removeClass('drop-over');	
		    for (var i = 0, f; f = files[i]; i++) {

		    }
		    //Additional data for the ajax call
		    if(plugin.settings.data){
		    	if(typeof(plugin.settings.data === 'function')){
		    		plugin.data = plugin.settings.data();
		    	}
		    	else plugin.data = plugin.settings.data;
		    }

		    if(plugin.settings.showFileList){
		    	plugin.showFileList(files);
		    }	    
		    if(plugin.settings.showUploadProgress){
		    	plugin.showUploadProgress(files);
		    }	    

		    
		};
		plugin.fileUpload = function(a,f){
			
			console.log(f);
			var s = plugin.settings.uploadStatus;
			var el = '#uploaded-file' + a ;
			plugin.data.FrontCoverImage = f;
			console.log(plugin.data);
			
			$.ajax({
				url: plugin.settings.url,
				dataType: plugin.settings.dataType,
				method: plugin.settings.url,
				data: plugin.data,
				cache: false,
	            contentType: false,
	            processData: false,
	            forceSync: false,
				// xhr: function() {
				// 	var i = $.ajaxSettings.xhr();
				// 	if (i.upload) {
				// 		i.upload.addEventListener("progress", function(m) {
				// 			var l = 0;
				// 			var j = m.loaded || m.position;
				// 			var k = m.total || e.totalSize;
				// 			if (m.lengthComputable) {
				// 				l = Math.ceil(j / k * 100)
				// 			}
				// 			plugin.onUploadProgress(s,el,l);
				// 		}, false)
				// 	}
				// 	return i
				// },
				success: function(response){
					console.log(response);
					plugin.onUploadSuccess(s,el, '100%');
				},
				error: function(response){
					console.log(response);
					plugin.onUploadFailure(s,el, '100%');
				}
			});
					
		};

		plugin.onUploadProgress = function(s,el,p){
			plugin.showProgressStatus(el,s.uploadProgress.text, s.uploadProgress.className,s.uploadProgress.icon, p);
		}
		plugin.onUploadSuccess = function(s,el,p){
			plugin.showProgressStatus(el,s.uploadSuccess.text, s.uploadSuccess.className,s.uploadSuccess.icon, p);
		}
		plugin.onUploadFailure = function(s,el,p){
			plugin.showProgressStatus(el,s.uploadFail.text, s.uploadFail.className,s.uploadFail.icon, p);
		}

		plugin.showFileList = function(files){
			var output = [];
			for (var i = 0, f; f = files[i]; i++) {
				output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
					f.size, ' bytes, last modified: ',
					f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
					'</li>');
			}
			$this.after('<output id="file-details" />');

			$('#file-details').html('<ul>' + output.join('') + '</ul>');

		};
		plugin.showUploadProgress = function(files){			
			var template = '';
			for (var i = 0, f; f = files[i]; i++) {
				template = '<div class="col-sm-6"><div class="uploaded-file-item" id="uploaded-file' + i + '"><p class="file-name" title="' + f.name + '">' + f.name + '</p><p class="file-size">' + plugin.humanizeSize(f.size) + '</p><div class="progress progress-custom active"><div class="progress-bar '+ plugin.settings.uploadStatus.uploadProgress.className +'" role="progressbar" style="width: 0%;"><span class=""><span class="upload-status">'+ plugin.settings.uploadStatus.uploadProgress.icon +' '+ plugin.settings.uploadStatus.uploadProgress.text +'</span><span class="upload-percentage">0%</span> </span></div></div></div></div>';
				$('#upload-progress').prepend(template);
				plugin.fileUpload(i,f);
			}
		};
		plugin.humanizeSize = function (e) {
			var d = Math.floor(Math.log(e) / Math.log(1024));
			return (e / Math.pow(1024, d)).toFixed(2) * 1 + " " + ["B", "kB", "MB", "GB", "TB"][d]
		};

		plugin.showProgressStatus = function (a,b,c,d,e) {
			$(a).find("div.progress-bar").removeClass().addClass('progress-bar ' + c ).width(e);
			$(a).find(".upload-status").html(d+' '+b);
			$(a).find(".upload-percentage").html(e);
		};



		//Initialize the plugin
		plugin.init();

	}
})();