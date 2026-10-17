extends Control
## Title screen: Play starts the arena.

const BASE_MAP: PackedScene = preload("uid://1iuc84vq5o3r")

@onready var _play_button: Button = %play_button


func _ready() -> void:
	_play_button.grab_focus()  # keyboard and gamepad start on Play


func _on_play_button_pressed() -> void:
	get_tree().change_scene_to_packed(BASE_MAP)
