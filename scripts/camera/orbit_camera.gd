extends Camera3D
## Orbit camera: hold the orbit action and drag to turn around the target, zoom actions move in and out.
## Usage: instance in a map, set target, distance and pitch in the inspector. Pitch 0.8 is the tactical default angle.

const ORBIT_SPEED: float = 0.005  # radians per pixel dragged
const ZOOM_STEP: float = 1.1
const MIN_PITCH: float = 0.15
const MAX_PITCH: float = 1.5  # short of straight down, where look_at has no up direction
const MIN_DISTANCE: float = 5.0
const MAX_DISTANCE: float = 30.0

@export var target: Vector3 = Vector3.ZERO
@export var distance: float = 14.0
@export var pitch: float = 0.8
@export var yaw: float = 0.0


func _ready() -> void:
	_place()


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.is_action_pressed("orbit"):
		var motion: Vector2 = (event as InputEventMouseMotion).relative
		yaw -= motion.x * ORBIT_SPEED
		pitch = clampf(pitch + motion.y * ORBIT_SPEED, MIN_PITCH, MAX_PITCH)
	elif event.is_action_pressed("zoom-in"):
		distance = maxf(distance / ZOOM_STEP, MIN_DISTANCE)
	elif event.is_action_pressed("zoom-out"):
		distance = minf(distance * ZOOM_STEP, MAX_DISTANCE)
	else:
		return
	_place()


func _place() -> void:
	var offset: Vector3 = Vector3(sin(yaw) * cos(pitch), sin(pitch), cos(yaw) * cos(pitch)) * distance
	look_at_from_position(target + offset, target)
