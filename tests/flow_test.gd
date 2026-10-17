extends SceneTree
## Headless menu flow check, exit code is the failure count.
## Run: godot --headless --path . --script res://tests/flow_test.gd

const MAIN_MENU: PackedScene = preload("uid://b1blpff1o58k7")

var _failures: int = 0


func _initialize() -> void:
	create_timer(10.0).timeout.connect(quit.bind(1))  # a script error stops _run, so fail instead of hanging
	_run()


func _run() -> void:
	change_scene_to_packed(MAIN_MENU)
	await _frames(2)
	_press("play_button")
	await _frames(2)
	_expect(current_scene.name == &"base_map", "Play opens the map")

	_send_pause()
	await _frames(1)
	_expect(paused, "pause action pauses")

	_send_pause()
	await _frames(1)
	_expect(not paused, "pause action unpauses, so the menu processes while paused")

	_send_pause()
	await _frames(1)
	_press("main_menu_button")
	await _frames(2)
	_expect(current_scene.name == &"main_menu", "Main Menu returns to the title")
	_expect(not paused, "leaving the map unpauses")

	print("flow test: %d failures" % _failures)
	quit(_failures)


func _frames(count: int) -> void:
	for _i: int in count:
		await process_frame


func _press(button_name: String) -> void:
	(current_scene.find_child(button_name, true, false) as Button).pressed.emit()


# push_input respects process modes, so this also checks the pause menu runs while paused
func _send_pause() -> void:
	var event: InputEventAction = InputEventAction.new()
	event.action = &"pause"
	event.pressed = true
	root.push_input(event)


func _expect(ok: bool, what: String) -> void:
	if ok:
		return
	_failures += 1
	push_error("FAIL: " + what)
