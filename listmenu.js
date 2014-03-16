function ListMenu (settings) {
 var listmenu = {}
 // Initialize settings.
 if (typeof settings == "undefined") settings = {}
 listmenu.container_tag = (typeof settings.container_tag != "undefined") ? settings.container_tag.toLowerCase() : 'ul'
 listmenu.list_item_tag = (typeof settings.list_item_tag != "undefined") ? settings.list_item_tag.toLowerCase() : 'li'
 listmenu.css_lit_class = 'highlighted'
 
 // Delay should be in 25 millisecond increments.
 listmenu.show_delay              = (typeof settings.show_delay       != "undefined") ? settings.show_delay       : 500
 listmenu.hide_delay              = (typeof settings.hide_delay       != "undefined") ? settings.hide_delay       : 250
 listmenu.hide_stick_delay        = (typeof settings.hide_stick_delay != "undefined") ? settings.hide_stick_delay : 150
 listmenu.show_stick_delay        = (typeof settings.show_stick_delay != "undefined") ? settings.show_stick_delay : 0
 listmenu.touch_events            = ('touch_events'            in settings) ? settings.touch_events            : false
 listmenu.hide_on_touch_elsewhere = ('hide_on_touch_elsewhere' in settings) ? settings.hide_on_touch_elsewhere : true
 listmenu.show_on_click           = ('show_on_click'           in settings) ? settings.show_on_click           : false
 listmenu.hide_on_click           = ('hide_on_click'           in settings) ? settings.hide_on_click           : false
 listmenu.hide_on_left_click      = ('hide_on_left_click'      in settings) ? settings.hide_on_left_click      : true
 listmenu.show_on_mouseover       = ('show_on_mouseover'       in settings) ? settings.show_on_mouseover       : true
 listmenu.hide_on_mouseover       = ('hide_on_mouseover'       in settings) ? settings.hide_on_mouseover       : true
 listmenu.animate                 = ('animate'                 in settings) ? settings.animate : undefined
 listmenu.show_process_timeout_time = (typeof settings.show_process_timeout_time != "undefined") ? settings.show_process_timeout_time : 25
 listmenu.hide_process_timeout_time = (typeof settings.hide_process_timeout_time != "undefined") ? settings.hide_process_timeout_time : 25
 
 var highlight = listmenu.highlight = function (obj) {
  if (typeof obj.listmenu_settings == "undefined") obj.listmenu_settings = {}
  if ((typeof obj.listmenu_settings.selected != "undefined") && (obj.listmenu_settings.selected == false)) return
  obj.classList.add (listmenu.css_lit_class)
 }
 var unhighlight = listmenu.unhighlight = function (obj) {
  if (typeof obj.listmenu_settings == "undefined") obj.listmenu_settings = {}
  if ((typeof obj.listmenu_settings.selected != "undefined") && (obj.listmenu_settings.selected == true)) return
  obj.classList.remove (listmenu.css_lit_class)
 }
 var set_selected = listmenu.set_selected = function (obj) {
  if (typeof obj.listmenu_settings == "undefined") obj.listmenu_settings = {}
  if (obj.listmenu_settings.unselectable) return
  obj.listmenu_settings.selected = true
  highlight (obj)
 }
 var clear_selected = listmenu.clear_selected = function (obj) {
  if (typeof obj.listmenu_settings == "undefined") obj.listmenu_settings = {}
  obj.listmenu_settings.selected = false
  unhighlight (obj)
 }
 var toggle_selected = listmenu.toggle_selected = function (obj) {
  if (typeof obj.listmenu_settings == "undefined") obj.listmenu_settings = {}
  obj.listmenu_settings.selected = !obj.listmenu_settings.selected
  if (obj.listmenu_settings.selected == true) {highlight (obj)} else {unhighlight (obj)}
 }
 var queued_events = []
 
 listmenu.create_menu = function (obj, settings) {
  if (typeof settings == "undefined") settings = {}
  var settings_touch_events            = ('touch_events'            in settings) ? settings.touch_events            : listmenu.touch_events
  var settings_hide_on_touch_elsewhere = ('hide_on_touch_elsewhere' in settings) ? settings.hide_on_touch_elsewhere : listmenu.hide_on_touchdown
  var settings_show_on_click           = ('show_on_click'           in settings) ? settings.show_on_click           : listmenu.show_on_click
  var settings_hide_on_click           = ('hide_on_click'           in settings) ? settings.hide_on_click           : listmenu.hide_on_click
  var settings_hide_on_left_click      = ('hide_on_left_click'      in settings) ? settings.hide_on_left_click      : listmenu.hide_on_left_click
  var settings_show_on_mouseover       = ('show_on_mouseover'       in settings) ? settings.show_on_mouseover       : listmenu.show_on_mouseover
  var settings_hide_on_mouseover       = ('hide_on_mouseover'       in settings) ? settings.hide_on_mouseover       : listmenu.hide_on_mouseover
  obj.is_open = false
  recurse_gen (obj)
  if (settings_touch_events && settings_hide_on_touch_elsewhere) {
   document.addEventListener ('mousedown', body_touchstart_listener)
   function body_touchstart_listener (evt) {
    if ((obj instanceof HTMLElement == false) || (is_attached(obj) == false)) document.body.removeEventListener ('mousedown', body_touchstart_listener)
    if ((obj == evt.target) || (obj.contains(evt.target))) return
    evt.stopPropagation ()
    if (obj.listmenu_settings.is_open == false) return
    // Close the menu.
    listmenu.unhighlight (obj)
    listmenu.close (obj)
   }
  }
  function recurse_gen (obj) {
   if (obj.tagName.toLowerCase() == listmenu.container_tag) {var container = obj} else {var container = obj.querySelector (listmenu.container_tag)}
   if (typeof container.listmenu_settings == "undefined") container.listmenu_settings = {}
   var is_root = (typeof container.listmenu_settings.parent == "undefined")
   var list_items = container.listmenu_settings.children = get_elements_until (container, listmenu.list_item_tag, listmenu.container_tag)
   if (!is_root) container.style.display = "none"
   for (var i = 0, curlen = list_items.length; i < curlen; i++) {
    var list_item = list_items[i]
    if (typeof list_item.listmenu_settings == "undefined") list_item.listmenu_settings = {}
    if (typeof list_item.listmenu_settings.is_open            == "undefined") list_item.listmenu_settings.is_open           = false
    if (typeof list_item.listmenu_settings.hide_on_left_click == "undefined") list_item.listmenu_settings.hide_on_left_click = settings_hide_on_left_click
    list_item.listmenu_settings.parent = container
    var child_child = list_item.querySelector(listmenu.container_tag)
    if (child_child != null) {
     list_item.listmenu_settings.children = [child_child]
     if (typeof child_child.listmenu_settings == "undefined") child_child.listmenu_settings = {}
     child_child.listmenu_settings.parent = list_item
     recurse_gen (child_child)
    } else {
     list_item.listmenu_settings.children = []
    }
    // Add mouseover, mouseout, and mouseup events on the list_item elements.
    if (settings_touch_events == true) {
     list_item.addEventListener ('touchstlart', show_event)
    } else {
     if ((settings_hide_on_click == true) && (settings_hide_on_click == true)) {
      list_item.addEventListener ('mouseup', show_or_hide_event)
     } else {
      if (settings_hide_on_click == true) list_item.addEventListener ('mouseup', function (evt) {hide_event (evt, true, true)})
      if (settings_show_on_click == true) list_item.addEventListener ('mouseup', function (evt) {show_event (evt, true, true)})
     }
     if (settings_hide_on_mouseover == true) list_item.addEventListener ('mouseout' , hide_event)
     if (settings_show_on_mouseover == true) list_item.addEventListener ('mouseover', show_event)
    }
    list_item.addEventListener ((settings_touch_events == true) ? 'touchstart' : 'mouseup', click_event)
   }
  }
 }
 
 function clear_queued_events () {
  for (var i = 0, curlen = queued_events.length; i < curlen; i++) {clearTimeout (queued_events[i])}
  queued_events = []
 }
 
 function show_or_hide_event (evt) {
  if (hide_event (evt, true, true) == false) show_event (evt, true, true)
 }
 
 function hide_event (evt, hide_on_click, is_immediate) {
  var list_item = evt.currentTarget
  if ((typeof hide_on_click != "undefined") && (hide_on_click == true)) {
   if ((list_item.listmenu_settings.hide_on_left_click == false) && (('which' in evt && evt.which == 3) || ('button' in evt && evt.button == 3))) return false
   if (list_item.listmenu_settings.is_open == false) return false
   var container_list = list_item.listmenu_settings.children
  } else {
   var container_list = [list_item.listmenu_settings.parent]
   if (container_list[0].contains(evt.relatedTarget)) return false
  }
  clear_queued_events ()
  if ((listmenu.hide_stick_delay == 0) || (is_immediate == true)) {return hide_event_cont()} else {queued_events.push (setTimeout (hide_event_cont, listmenu.hide_stick_delay))}
  function hide_event_cont () {
   // If root menu, hide children's children instead of hiding self.
   for (var i = 0, curlen = container_list.length; i < curlen; i++) {
    var container = container_list[i]
    if (typeof container.listmenu_settings.parent == "undefined") {
     var hide_list = hide_grandchildren (container, 0)
    } else {
     var hide_list = hide_children (container.listmenu_settings.parent)
    }
   }
   begin_process (hide_list, 'hide')
   return true
  }
 }
 
 function show_event (evt, show_on_click, is_immediate) {
  evt.stopPropagation ()
  var list_item = evt.currentTarget
  if (show_on_click && (('which' in evt && evt.which == 3) || ('button' in evt && evt.button == 3))) return false
  if (show_on_click && (list_item.listmenu_settings.is_open == true)) return false
  clear_queued_events ()
  
  if ((listmenu.show_stick_delay == 0) || (is_immediate == true)) {return show_event_cont()} else {queued_events.push (setTimeout (show_event_cont, listmenu.show_stick_delay))}
  function show_event_cont () {
   if (show_on_click && (list_item.listmenu_settings.is_open == true)) return false
   // Show own children.
   var show_list = show_children (list_item)
   
   // Hide siblings' children.
   var siblings = list_item.listmenu_settings.parent.listmenu_settings.children
   var hide_list = []
   for (var i = 0, curlen = siblings.length; i < curlen; i++) {
    if (siblings[i] != list_item) hide_list = hide_list.concat (hide_children (siblings[i]))
   }
   
   begin_process (show_list, 'show')
   begin_process (hide_list, 'hide')
   return true
  }
 }
  
 function show_children (list_item, record) {
  var display_type = (typeof list_item.listmenu_settings.parent != "undefined") ? "block" :  "inline-block"
  var children = list_item.listmenu_settings.children
  return children
 }
  
 function hide_children (list_item, level) {
  var children = list_item.listmenu_settings.children
  var descendant_list = children
  for (var i = 0, curlen = children.length; i < curlen; i++) {
   var container = children[i]
   if (typeof container.listmenu_settings.children != "undefined") descendant_list = descendant_list.concat (hide_grandchildren (container, level))
  }
  return descendant_list
 }
 
 function hide_grandchildren (container, level) {
  if (typeof level != "undefined") {var new_level = level + 1} else {var new_level = undefined}
  var children = container.listmenu_settings.children
  var descendant_list = []
  for (var i = 0, curlen = children.length; i < curlen; i++) {
   var list_item = children[i]
   if ((typeof level == "undefined") || (level > 0)) listmenu.unhighlight (list_item)
   descendant_list = descendant_list.concat (hide_children (list_item, new_level))
  }
  return descendant_list
 }
 
 // Run the show or hide process function.
 function begin_process (showhide_list, showhide, options) {
  for (var i = 0, curlen = showhide_list.length; i < curlen; i++) {
   if (typeof showhide_list[i].listmenu_settings.parent != "undefined") {
    showhide_list[i].listmenu_settings.parent.listmenu_settings.is_open = (showhide == 'show') ? true : false
   }
  }
  if ((typeof listmenu.animate) == "undefined") return
  if (typeof options == "undefined") options = {}
  // If options.instant is set to true, show/hide immediately. If that's not set and true, try the listmenu default delay.
  var showhide_delay = (('instant' in options) && (options.instant == true)) ? 0 : listmenu[showhide + '_delay']
  
  // If an element is included in this showhide_list, remove it from its current showhide_list, if it exists.
  // Further, make the element aware what showhide_list it is in.
  var showhide_list_new = []
  var j = 0; for (var i = 0, curlen = showhide_list.length; i < curlen; i++) {
   var obj = showhide_list[i]
   if (typeof obj.listmenu_settings == "undefined") obj.listmenu_settings = {}
   if (typeof obj.listmenu_settings.showhide_list != "undefined") {
    var showhide_list_temp = obj.listmenu_settings.showhide_list
    showhide_list_temp[obj.listmenu_settings.showhide_list_index] = undefined
   }
   // Don't add already hidden elements if showhide is "hide" and display is "none".
   if ((showhide == 'hide') && (obj.style.display == 'none')) continue
   obj.listmenu_settings.showhide_list       = showhide_list_new
   obj.listmenu_settings.showhide_list_index = j
   j += 1
   showhide_list_new.push (obj)
  }
  showhide_list = showhide_list_new
  var max_steps = (listmenu[showhide + '_process_timeout_time'] == 0) ? 1 : showhide_delay / listmenu[showhide + '_process_timeout_time'] + 1
  var current_step = 0
  showhide_process_internal ()
  function showhide_process_internal () {
   if (current_step > max_steps) return
   var current_counter = current_step / max_steps
   if (showhide == 'hide') current_counter = 1 - current_counter
   listmenu.animate (showhide_list, current_counter, showhide)
   current_step += 1
   setTimeout (showhide_process_internal, settings[showhide + '_process_timeout_time'])
  }
 }
 
 function click_event (evt)  {
  evt.stopPropagation ()
  if (('which' in evt && evt.which == 3) || ('button' in evt && evt.button == 3)) return
  var list_item = evt.currentTarget
  if (list_item.listmenu_settings.children.length != 0) return
  var siblings = list_item.listmenu_settings.parent.listmenu_settings.children
  for (var i = 0, curlen = siblings.length; i < curlen; i++) {
   if (siblings[i] != list_item) clear_selected (siblings[i])
  }
  set_selected (list_item)
  
  // Close the menu.
  var hide_list = hide_ancestors_and_self (list_item.listmenu_settings.parent, [])
  begin_process (hide_list, 'hide')
 }
 
 function hide_ancestors_and_self (container, hide_list) {
  if (typeof container.listmenu_settings.parent == "undefined") return hide_list
  hide_list.push (container)
  var container = container.listmenu_settings.parent.listmenu_settings.parent
  // Only modify the container node.
  return hide_ancestors_and_self (container, hide_list)
 }
 
 listmenu.close = function (container, options) {begin_process (hide_grandchildren (container, 0), 'hide', options)}
 listmenu.open  = function (container, options) {begin_process (hide_grandchildren (container)   , 'show', options)}
 
 function get_elements_until (parent, tagname_to_search_for, tagname_to_stop_at) {
  var element_list = []
  check_children (parent)
  function check_children (parent) {
   var children = parent.childNodes
   for (var i = 0, curlen = children.length; i < curlen; i++) {
    var child = children[i], tagname = child.tagName
    if (typeof tagname == "undefined") continue
    tagname = tagname.toLowerCase ()
    if (tagname == tagname_to_search_for) element_list.push (child)
    if (tagname != tagname_to_stop_at) check_children (child)
   }
  }
  return element_list
 }
 return listmenu
 
 // Check if an element is attached to the DOM.
 function is_attached (obj) {
  while (true) {
   obj = obj.parentNode
   if (obj == document.documentElement) return true
   if (obj == null) return false
  }
 }
}

ListMenu.anim_fade = function (obj_list, counter, showhide) {
 for (var i = 0, curlen = obj_list.length; i < curlen; i++) {
  var obj = obj_list[i]
  if (typeof obj == "undefined") continue
  if (showhide == 'show') {
   if ((counter == 0) && (obj.style.display == "none")) {obj.style.opacity = 0; obj.style.display = "block"}
   if (obj.style.opacity <= counter) obj.style.opacity = counter
  } else {
   if  (counter == 0) obj.style.display = "none"
  }
 }
}
