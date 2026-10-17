extends CanvasLayer
## Pause menu: the pause action opens and closes it, and the open menu is the pause state.
## Usage: instance once in a map scene. It processes while the tree is paused, so it can unpause.

# loaded on use, not preloaded: the main menu preloads the map holding this menu, and a preload cycle leaves the scene empty
const MAIN_MENU_UID: String = "uid://b1blpff1o58k7"

@onready var _resume_button: Button = %resume_button


func _unhandled_input(event: InputEvent) -> void:
	if not event.is_action_pressed("pause"):
		return
	_set_open(not visible)
	get_viewport().set_input_as_handled()


func _set_open(open: bool) -> void:
	visible = open
	get_tree().paused = open
	if open:
		_resume_button.grab_focus()


func _on_resume_button_pressed() -> void:
	_set_open(false)


func _on_main_menu_button_pressed() -> void:
	_set_open(false)  # the tree's paused flag survives a scene change
	get_tree().change_scene_to_packed(load(MAIN_MENU_UID) as PackedScene)
