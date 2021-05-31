function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



$(function(){

	var filemanager = $('.filemanager'),
		breadcrumbs = $('.breadcrumbs'),
		fileList = filemanager.find('.data'),
		home = "";
	// Start by fetching the file data with an AJAX request
	var geturl = "https://raw.githubusercontent.com/DALFC/datealivesp/master/" + getParameterByName("server") + "/json/" + getParameterByName("version") + ".json";
	$.getJSON(geturl, function(data) {
		home = Object.keys(data)[0];
		var response = [data],
			currentPath = '',
			breadcrumbsUrls = [];

		var folders = [],
			files = [];

		// This event listener monitors changes on the URL. We use it to
		// capture back/forward navigation in the browser.

		$(window).on('hashchange', function(){

			goto(window.location.hash);

			// We are triggering the event. This will execute 
			// this function on page load, so that we show the correct folder:

		}).trigger('hashchange');

		// Clicking on folders

		fileList.on('click', 'li.folders', function(e){
			e.preventDefault();

			var nextDir = $(this).find('a.folders').attr('href');

			/*if(filemanager.hasClass('searching')) {

				// Building the breadcrumbs

				breadcrumbsUrls = generateBreadcrumbs(nextDir);

				filemanager.removeClass('searching');
				filemanager.find('input[type=search]').val('').hide();
				filemanager.find('span').show();
			}
			else {*/
				breadcrumbsUrls.push(nextDir);
			//}

			window.location.hash = encodeURIComponent(nextDir);
			currentPath = nextDir;
		});


		// Clicking on breadcrumbs

		breadcrumbs.on('click', 'a', function(e){
			e.preventDefault();

			var index = breadcrumbs.find('a').index($(this)),
				nextDir = breadcrumbsUrls[index];

			breadcrumbsUrls.length = Number(index);

			window.location.hash = encodeURIComponent(nextDir);

		});


		// Navigates to the given hash (path)

		function goto(hash) {

			hash = decodeURIComponent(hash).slice(1).split('=');

			if (hash.length) {
				var rendered = '';

				// if hash has search in it

				/*if (hash[0] === 'search') {

					filemanager.addClass('searching');
					rendered = searchData(response, hash[1].toLowerCase());

					if (rendered.length) {
						currentPath = hash[0];
						render(rendered);
					}
					else {
						render(rendered);
					}

				}

				// if hash is some path

				else */if (hash[0].trim().length) {
					rendered = searchByPath(hash[0]);

					if (Object.keys(rendered).length) {

						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);

					}
					else {
						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);
					}

				}

				// if there is no hash

				else {
					currentPath = Object.keys(data)[0];
					breadcrumbsUrls.push(Object.keys(data)[0]);
					render(searchByPath(Object.keys(data)[0]));
				}
			}
		}

		// Splits a file path and turns it into clickable breadcrumbs

		function generateBreadcrumbs(nextDir){
			var path = nextDir.split('/').slice(0);
			for(var i=1;i<path.length;i++){
				path[i] = path[i-1]+ '/' +path[i];
			}
			return path;
		}


		// Locates a file by path

		function searchByPath(dir) {
			var path = dir.split('/'),
				demo = data,
				flag = 0;
			for(var i=0;i<path.length;i++){
				for(var j=0;j<Object.keys(demo).length;j++){
					if(Object.keys(demo)[j] === path[i]){
						flag = 1;
						demo = demo[Object.keys(demo)[j]];
						break;
					}
				}
			}

			demo = flag ? demo : [];
			return demo;
		}


		// Recursively search through the file tree

		/*function searchData(data, searchTerms) {

			data.forEach(function(d){
				if(d.type === 'folder') {

					searchData(d.items,searchTerms);

					if(d.name.toLowerCase().match(searchTerms)) {
						folders.push(d);
					}
				}
				else if(d.type === 'file') {
					if(d.name.toLowerCase().match(searchTerms)) {
						files.push(d);
					}
				}
			});
			return {folders: folders, files: files};
		}*/


		// Render the HTML for the file manager

		function render(data) {

			var scannedFolders = [],
				scannedFiles = [];

			if(typeof data === 'object') {
				Object.keys(data).forEach(function (d) {
					if (typeof data[d][0] === 'string')
					{
						let newdata = {}
							newdata.name = d;
							newdata.md5 = data[d];
						scannedFiles.push(newdata);
					}
					else
					{
						let newdata = {}
							newdata[d] = data[d]
						scannedFolders.push(newdata);
					}

				});

			}


			// Empty the old result and make the new one

			fileList.empty().hide();

			if(!scannedFolders.length && !scannedFiles.length) {
				filemanager.find('.nothingfound').show();
			}
			else {
				filemanager.find('.nothingfound').hide();
			}

			if(scannedFolders.length) {

				scannedFolders.forEach(function(f) {
					var itemsLength = Object.keys(f).length,
						name = escapeHTML(Object.keys(f)[0]),
						icon = '<span class="icon folder"></span>';
					if (window.location.hash == "")
						hrefPath = home + "/" + name;
					else
						hrefPath = decodeURIComponent(window.location.hash.replace("#", "")) + "/" + name;
					if(itemsLength) {
						icon = '<span class="icon folder full"></span>';
					}

					if(itemsLength == 1) {
						itemsLength += ' item';
					}
					else if(itemsLength > 1) {
						itemsLength += ' items';
					}
					else {
						itemsLength = 'Empty';
					}

					var folder = $('<li class="folders"><a href="'+ hrefPath +'" title="'+ hrefPath +'" class="folders">'+icon+'<span class="name">' + name + '</span> <span class="details">' + itemsLength + '</span></a></li>');
					folder.appendTo(fileList);
				});

			}

			if(scannedFiles.length) {

				scannedFiles.forEach(function(f) {
					var fileMD5 = f.md5,
						name = escapeHTML(f.name),
						fileType = name.split('.'),
						icon = '<span class="icon file"></span>';
					if (window.location.hash == "")
						hrefPath = home + "/" + name;
					else
						hrefPath = decodeURIComponent(window.location.hash.replace("#", "")) + "/" + name;

					fileType = fileType[fileType.length-1];

					icon = '<span class="icon file f-'+fileType+'">.'+fileType+'</span>';
					var sv = getParameterByName("server"); //Lowercase
					var fileurl = hrefPath.replace(sv.toUpperCase(), sv);
					fileurl = "https://raw.githubusercontent.com/DALFC/datealivesp/master/" + fileurl;
					if (name.endsWith(".skel")) fileurl = "https://dalfc.github.io/spine/?url=" + fileurl;
					else if (name.endsWith(".moc3")) fileurl = "https://dalfc.github.io/live2d/?url=" + fileurl;
					else if (name.endsWith(".json") && name.indexOf("bust") === -1) fileurl = "https://dalfc.github.io/spine/?url=" + fileurl;
					else if (name.endsWith(".mp4")) fileurl = "https://dalfc.github.io/dalsp/viewer/video?url=" + fileurl.replace("master", "master/dal_video");
					var file = $('<li class="files"><a href="'+ fileurl +'" title="'+ hrefPath +'" class="files">'+icon+'<span class="name">'+ name +'</span><span class="details">'+fileMD5+'</span></a></li>');
					file.appendTo(fileList);
				});

			}


			// Generate the breadcrumbs

			var url = '';

			/*if(filemanager.hasClass('searching')){

				url = '<span>Search results: </span>';
				fileList.removeClass('animated');

			}
			else */{

				fileList.addClass('animated');

				breadcrumbsUrls.forEach(function (u, i) {

					var name = u.split('/');

					if (i !== breadcrumbsUrls.length - 1) {
						url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">→</span> ';
					}
					else {
						url += '<span class="folderName">' + name[name.length-1] + '</span>';
					}

				});

			}

			breadcrumbs.text('').append(url);


			// Show the generated elements

			fileList.animate({'display':'inline-block'});

		}


		// This function escapes special html characters in names

		function escapeHTML(text) {
			return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
		}


		// Convert file sizes from bytes to human readable units

		function bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}

	});
});
