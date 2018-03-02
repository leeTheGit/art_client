 (function()
{
	'use strict';

	Acme.effects = {
		cascadeOpen: false,
		left_pane_open: false,
		left_pane_content: null,
		importOpen: false,
		timeOut: null,

		debounce: function (func, wait, immediate) {
			return function() {
				var context = this, args = arguments;
				var later = function() {
					Acme.effects.timeOut = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !Acme.effects.timeOut;
				clearTimeout(Acme.effects.timeOut);
				Acme.effects.timeOut = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		},
		scroll: function(container, element)
		{
			container.animate({
			    scrollTop: element.offset().top - (container.offset().top * 1.5) + container.scrollTop()
			});
		},
		saved: function(elem)
		{
			elem.animate({
				backgroundColor: "rgba(167, 191, 81, 1)"
			}, 200).animate({
				backgroundColor: "rgba(0, 0, 0, 0)"
			}, 200, function() {
				$(this).removeAttr('style');
			});
		},
		error: function(elem)
		{
			var self = elem;
			self.addClass('error');

			setTimeout(function() {
				self.removeClass('error');
			}, 250);
		},
		errorMessage: function(message)
		{
			var temp = $('<div id="wrapper" class="flex_col"><div id="servermessage"><p>' + message + '</p></div></div>');
			temp.appendTo('body').hide()
								 .fadeIn(450);

			$('#servermessage').on('click', function(e) {
				$(this).parent().remove();
			});
								 // .delay(5000)
								 // .fadeOut(450, function() {$(this).remove();});
			// temp.appendTo('body').hide()
			// 					 .fadeIn(500);
		},
		message: function(message)
		{
			var temp = $('<div id="wrapper" class="flex_col"><div id="message"><p>' + message + '</p></div></div>');
			temp.appendTo('body').hide()
								 .fadeIn(450)
								 .delay(1000)
								 .fadeOut(450, function() {$(this).remove();});
			// temp.appendTo('body').hide()
			// 					 .fadeIn(500);
		},

		leftPaneToggle: function(mode, force)
		{
			if (this.left_pane_content == mode && force === true) return;
			if (this.left_pane_open === false) {
				this.left_pane_content = mode;
				this.leftPaneOpen();
				this.leftPaneButtonSelect();
                Acme.state.listener('update_state', {"portalwindow" : true});


			} else if (this.left_pane_open === true && this.left_pane_content != mode) {

				this.left_pane_content = mode;
				this.leftPaneButtonSelect();
			} else {
				this.leftPaneClose();
				$('.toggleRunners').remove();
				$('.toggleTips').remove();
                Acme.state.portalwindow = false;
			}
		},
		leftPaneOpen: function()
		{
			if (this.left_pane_open === false) {
				var tags = [$('.openPortal')];
				tags.forEach(function(elem, i) {
					elem.toggleClass('closeTag');
				});
				$('.right-side-panel').toggleClass('pullLeft');
				this.left_pane_open = true;
				$('#tabpanel').append('<div class="toggleTips selected">T</div>');
				$('#tabpanel').append('<div class="toggleRunners selected">R</div>');

				return true;
			}
			return false;
		},
		leftPaneClose: function()
		{
			if (this.left_pane_open === true) {
				var tags = [$('.openPortal')];
				var unfocus = ['portalUnfocus'];
				tags.forEach(function(elem, i) {
					elem.toggleClass('closeTag');
					elem.removeClass(unfocus[i]);
				});

				$('.right-side-panel').toggleClass('pullLeft');
				$('.right-side-panel').removeAttr('style');
				this.left_pane_open = false;
				this.left_pane_content = null;
			}
		},
		leftPaneButtonSelect: function()
		{
			var tags    = [$('.openPortal')];
			var modes   = ['portal'];
			var focus   = ['openPortal'];
			var unfocus = ['portalUnfocus'];
			var mode 	= modes.indexOf(this.left_pane_content);

			tags.forEach(function(elem, i) {
				elem.addClass(unfocus[i]);
				if (mode === i) {
					elem.toggleClass(unfocus[i]);
					return;
				}
			});
		}
	};

	Acme.dialog = {
		type : '',
		state : {},

		show : function(message, type, callback, self, data) {
			var that = this;
			var template  = '<div id="wrapper" class="flex_col"> <div id="dialog"><div><p id="dialogTitle">{{title}}</p><div id="dialogMessage">{{message}}</div>';
				template += '<ul id="dialogButtons"><button>Okay</button><button>Cancel</button></div></div></div>';

			template = template.replace( /{{title}}/ig, type);
			template = template.replace( /{{message}}/ig, message);
			var dfd = $.Deferred();

			$('body').append(template);
			$('#dialog').on("click", function(e) {
				var $elem = $(e.target);
				if (!$elem.is('input')) {
					e.preventDefault();
				}

				if ( $elem.is('button') ) {
					if ($elem.text() === "Cancel") {
						Acme.dialog.closeWindow();
					} else if ($elem.text() === "Okay") {
						Acme.dialog.closeWindow();

						// State can be provided by client external to 'show' call
						if (data === undefined && that.state) {
							data = that.state;
						// If data is also provided we merge the two
						} else if (that.state) {
							var keys = Object.keys(that.state)
							for (var k=0; k<keys.length;k++) {
								data[keys[k]] = that.state[keys[k]];
							}
						}

						if (self != undefined) {
							if (data != undefined) {
								var result = callback.call(self, data);
								dfd.resolve(result);
							} else {
								var result = callback.call(self);
								dfd.resolve(result);
							}
						} else {
							var result = callback();
							dfd.resolve(result);
						}
					}
				}
			});
			return dfd.promise();
		},
		closeWindow : function() {
			$('#dialog').closest('#wrapper').remove();
		}
	};

	Acme.confirmation = {
		show : function(title, message) {
			var self = this;
			var template  = '<div id="wrapper" class="flex_col"> <div id="dialog"><div><p id="dialogTitle">' + title + '</p><div id="dialogMessage">' + message + '</div>';
				template += '<ul id="dialogButtons"><button id="check_okay">Okay</button><button id="check_cancel">Cancel</button></div></div></div>';

			var dfd = $.Deferred();

			$('body').append(template);

			$('#check_okay').on("click", function() {
				self.closeWindow();
				dfd.resolve();
			});

			$('#check_cancel').on("click", function() {
				self.closeWindow();
				dfd.reject();
			});

			return dfd.promise();
		},
		closeWindow : function() {
			$('#dialog').closest('#wrapper').remove();
		}
	};

	Acme.modal = {
		show : function(title, edit, data, callback) {
			var self = this;
			var template  = '<div id="wrapper" class="flex_col"><div id="modal"><div id="modalMessage"></div>';
				template += '<div class="modal_container"><div id="modalTitle"></div><input type="search" class="modal_filter" id="list_filter" placeholder="Filter"><div class="modal_list">';
				template += '<div id="modal_list"></div></div></div>';
				template += '<ul id="dialogButtons"><button>Cancel</button></div></div>';

			var dfd = $.Deferred();

			$('body').append(template);

			$('#modalTitle').html(title);
			$('#modalMessage').html(edit.template);
			$('#modalMessage').append('<div class="flex1"><button id="save_button">Save</button></div>');
			$('#save_button').on("click", function() {
				var value = $("#edit_val").val();
				Acme.confirmation.show("Edit", "Do you want to change " + edit.text + " into " + value + "? This will affect every instance of " + edit.text).then(function() {
					edit.callback(value);
				});
				self.closeWindow();
			});

			self.update(data);

			$('#list_filter').on("keyup", function() {
				var filter = $('#list_filter').val().toLowerCase();

				self.update(data.filter(function(i) {
					var name = i.name.toLowerCase();
					return name.indexOf(filter) != -1;
				}));

			});

			$('#modal_list').on("click", function(e) {
				var $elem = $(e.target);
				if ($elem.is('li')) {
					var id = $elem.data('id');
					if (id != undefined) {
						var result = callback(id);
						dfd.resolve(result);
						self.closeWindow();
					}
				};
			});

			$('#modal').on("click", function(e) {
				var $elem = $(e.target);
				if (!$elem.is('input')) {
					e.preventDefault();
				}

				if ( $elem.is('button') ) {
					if ($elem.text() === "Cancel") {
						self.closeWindow();
					}
				}
			});

			return dfd.promise();
		},
		closeWindow : function() {
			$('#modal').closest('#wrapper').remove();
		},
		update: function(data) {

			data.unshift({id: '', name: 'None'});

			var list = data.map(function(i) {
				return '<li data-id="' + i.id + '">' + i.name + '</li>';
			});

			$('#modal_list').html('<ul>' + list.join('') + '</ul>');
		},
	};

})();
