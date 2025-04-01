1. Разархивирповать архив
2. Инициализировать проект командой: npm i
3. Запустить командой: npm run dev
4. Перейти по ссылке в браузере http://localhost:3000

   Android App Signaling Server Web App
   | | |
   |--- Подключение к серверу ----> | |
   | | |
   |--- Создание offer ------------>| |
   | | |
   | |--- Передача offer ------------>|
   | | |
   | |<--- Создание answer -----------|
   | | |
   |<--- Передача answer -----------| |
   | | |
   |--- Установка WebRTC ---------->|<--- Установка WebRTC ----------|
   | | |
   |--- Передача видео ------------>|<--- Получение видео -----------|

Инструкция для андройда

1.  Создание проекта Android
    // build.gradle (app level)
    dependencies {
    implementation 'com.squareup.okhttp3:okhttp:4.9.3'
    implementation 'com.google.code.gson:gson:2.8.9'
    }
2.  Создание WebSocket клиента
    // WebSocketManager.kt
    class WebSocketManager(private val context: Context) {
    private var webSocket: WebSocket? = null
    private val client = OkHttpClient()
    private val gson = Gson()

        fun connect() {
            val request = Request.Builder()
                .url("ws://your-server-ip:3001")  // Замените на ваш IP-адрес
                .build()

            webSocket = client.newWebSocket(request, object : WebSocketListener() {
                override fun onOpen(webSocket: WebSocket, response: Response) {
                    sendMessage(WebSocketMessage("status", "Подключено"))
                }

                override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                    sendMessage(WebSocketMessage("error", t.message ?: "Ошибка подключения"))
                }

                override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                    sendMessage(WebSocketMessage("status", "Отключение..."))
                }

                override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                    sendMessage(WebSocketMessage("status", "Отключено"))
                }
            })
        }

        fun sendMessage(message: WebSocketMessage) {
            webSocket?.send(gson.toJson(message))
        }

        fun disconnect() {
            webSocket?.close(1000, "Закрытие соединения")
        }

        data class WebSocketMessage(
            val type: String,
            val data: Any,
            val timestamp: Long = System.currentTimeMillis()
        )

    }

3.  Создание сервиса для работы с камерой
    // CameraService.kt
    class CameraService(private val context: Context) {
    private var camera: Camera2Proxy? = null
    private val webSocketManager = WebSocketManager(context)

        fun startCamera() {
            camera = Camera2Proxy(context, object : Camera2Proxy.Callback {
                override fun onFrameAvailable(data: ByteArray) {
                    // Отправка кадра через WebSocket
                    webSocketManager.sendMessage(
                        WebSocketManager.WebSocketMessage(
                            type = "video",
                            data = mapOf(
                                "size" to data.size,
                                "frame" to Base64.encodeToString(data, Base64.DEFAULT)
                            )
                        )
                    )
                }

                override fun onError(error: String) {
                    webSocketManager.sendMessage(
                        WebSocketManager.WebSocketMessage("error", error)
                    )
                }
            })
            camera?.startPreview()
        }

        fun stopCamera() {
            camera?.stopPreview()
            camera = null
        }

    }

4.  Создание Activity:
    // MainActivity.kt
    class MainActivity : AppCompatActivity() {
    private lateinit var cameraService: CameraService
    private lateinit var webSocketManager: WebSocketManager

        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)

            webSocketManager = WebSocketManager(this)
            cameraService = CameraService(this)

            // Запрос разрешений
            if (checkPermissions()) {
                startServices()
            } else {
                requestPermissions()
            }
        }

        private fun startServices() {
            webSocketManager.connect()
            cameraService.startCamera()
        }

        private fun checkPermissions(): Boolean {
            return ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        }

        private fun requestPermissions() {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.CAMERA),
                CAMERA_PERMISSION_REQUEST_CODE
            )
        }

        override fun onDestroy() {
            super.onDestroy()
            cameraService.stopCamera()
            webSocketManager.disconnect()
        }

        companion object {
            private const val CAMERA_PERMISSION_REQUEST_CODE = 100
        }

    }

5.  Добавление разрешений в AndroidManifest.xml
    <manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" />
        <application
            android:usesCleartextTraffic="true"
            ...>
        </application>
    </manifest>
