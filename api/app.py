from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123@localhost:5432/SecApp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelos
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    dni = db.Column(db.String(20))
    anonimo = db.Column(db.Boolean, default=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    push_token = db.Column(db.Text)  # Token para notificaciones push

class Reporte(db.Model):
    __tablename__ = 'reportes'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    tipo = db.Column(db.String(30))
    titulo = db.Column(db.String(100))
    descripcion = db.Column(db.Text)
    direccion = db.Column(db.String(200))
    latitud = db.Column(db.Float)
    longitud = db.Column(db.Float)
    estado = db.Column(db.String(20), default='Activo')
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    anonimo = db.Column(db.Boolean, default=False)
    foto_url = db.Column(db.Text)

class Confirmacion(db.Model):
    __tablename__ = 'confirmaciones'
    id = db.Column(db.Integer, primary_key=True)
    reporte_id = db.Column(db.Integer, db.ForeignKey('reportes.id'))
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    fecha = db.Column(db.DateTime, default=datetime.utcnow)

# Modelos adicionales
class ObjetoSustraido(db.Model):
    __tablename__ = 'objetos_sustraidos'
    id = db.Column(db.Integer, primary_key=True)
    reporte_id = db.Column(db.Integer, db.ForeignKey('reportes.id'))
    objeto = db.Column(db.String(100))

class Sospechoso(db.Model):
    __tablename__ = 'sospechosos'
    id = db.Column(db.Integer, primary_key=True)
    reporte_id = db.Column(db.Integer, db.ForeignKey('reportes.id'))
    nombre = db.Column(db.String(100))
    descripcion = db.Column(db.Text)

# Función para enviar notificación push
def send_push_notification(title, body, data=None):
    try:
        # Obtener todos los tokens de dispositivos registrados
        usuarios = Usuario.query.filter(Usuario.push_token.isnot(None)).all()
        tokens = [usuario.push_token for usuario in usuarios if usuario.push_token]
        
        if not tokens:
            print("No hay dispositivos registrados para notificaciones")
            return
        
        # Enviar notificación a todos los dispositivos
        messages = []
        for token in tokens:
            message = {
                "to": token,
                "sound": "default",
                "title": title,
                "body": body,
                "data": data or {},
                "priority": "high"
            }
            messages.append(message)
        
        # Enviar usando Expo Push API
        response = requests.post(
            'https://exp.host/--/api/v2/push/send',
            headers={
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            json=messages
        )
        
        if response.status_code == 200:
            print(f"✅ Notificación enviada a {len(tokens)} dispositivos")
        else:
            print(f"❌ Error enviando notificación: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error en send_push_notification: {e}")

# Endpoints de autenticación
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    usuario = Usuario.query.filter_by(email=email, password=password).first()
    if usuario:
        return jsonify({
            'success': True,
            'usuario': {
                'id': usuario.id,
                'email': usuario.email,
                'dni': usuario.dni,
                'fecha_registro': usuario.fecha_registro.isoformat()
            }
        }), 200
    else:
        return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    dni = data.get('dni')
    
    # Verificar si ya existe
    if Usuario.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'El email ya está registrado'}), 400
    
    # Crear nuevo usuario
    nuevo_usuario = Usuario(email=email, password=password, dni=dni)
    db.session.add(nuevo_usuario)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'usuario': {
            'id': nuevo_usuario.id,
            'email': nuevo_usuario.email,
            'dni': nuevo_usuario.dni,
            'fecha_registro': nuevo_usuario.fecha_registro.isoformat()
        }
    }), 201

# Endpoint para registrar token de notificaciones
@app.route('/register-push-token', methods=['POST'])
def register_push_token():
    data = request.json
    usuario_id = data.get('usuario_id')
    push_token = data.get('push_token')
    
    usuario = Usuario.query.get(usuario_id)
    if usuario:
        usuario.push_token = push_token
        db.session.commit()
        return jsonify({'success': True, 'message': 'Token registrado exitosamente'}), 200
    else:
        return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

# Endpoints básicos
@app.route('/reportes', methods=['GET'])
def obtener_reportes():
    reportes = Reporte.query.all()
    return jsonify([{
        'id': r.id,
        'tipo': r.tipo,
        'titulo': r.titulo,
        'descripcion': r.descripcion,
        'direccion': r.direccion,
        'latitud': r.latitud,
        'longitud': r.longitud,
        'estado': r.estado,
        'fecha': r.fecha.isoformat() if r.fecha else None,
        'anonimo': r.anonimo,
        'foto_url': r.foto_url
    } for r in reportes])

@app.route('/reportes', methods=['POST'])
def crear_reporte():
    data = request.json
    nuevo = Reporte(
        usuario_id=data.get('usuario_id'),
        tipo=data['tipo'],
        titulo=data['titulo'],
        descripcion=data['descripcion'],
        direccion=data['direccion'],
        latitud=data.get('latitud'),
        longitud=data.get('longitud'),
        anonimo=data.get('anonimo', False),
        foto_url=data.get('foto_url')
    )
    db.session.add(nuevo)
    db.session.commit()
    
    # Agregar objetos sustraídos si existen
    if data.get('objetos'):
        objetos = data['objetos'].split(',')
        for obj in objetos:
            if obj.strip():
                objeto = ObjetoSustraido(reporte_id=nuevo.id, objeto=obj.strip())
                db.session.add(objeto)
    
    # Agregar sospechosos si existen
    if data.get('sospechosos'):
        sosp = Sospechoso(reporte_id=nuevo.id, nombre='Sospechoso', descripcion=data['sospechosos'])
        db.session.add(sosp)
    
    db.session.commit()
    
    # Enviar notificación push a todos los usuarios
    notification_title = f"🚨 Nuevo reporte: {data['tipo']}"
    notification_body = f"{data['titulo']} - {data['direccion']}"
    notification_data = {
        'tipo': 'nuevo_reporte',
        'reporte_id': nuevo.id,
        'tipo_incidente': data['tipo']
    }
    
    send_push_notification(notification_title, notification_body, notification_data)
    
    return jsonify({'msg': 'Reporte creado', 'id': nuevo.id}), 201

@app.route('/reportes/<int:reporte_id>/confirmar', methods=['POST'])
def confirmar_reporte(reporte_id):
    data = request.json
    usuario_id = data.get('usuario_id')
    
    # Verificar si ya confirmó
    confirmacion_existe = Confirmacion.query.filter_by(reporte_id=reporte_id, usuario_id=usuario_id).first()
    if confirmacion_existe:
        return jsonify({'msg': 'Ya confirmaste este reporte'}), 400
    
    # Crear confirmación
    confirmacion = Confirmacion(reporte_id=reporte_id, usuario_id=usuario_id)
    db.session.add(confirmacion)
    
    # Actualizar estado del reporte si tiene suficientes confirmaciones
    confirmaciones_count = Confirmacion.query.filter_by(reporte_id=reporte_id).count() + 1
    if confirmaciones_count >= 3:  # Si tiene 3+ confirmaciones, marcar como resuelto
        reporte = Reporte.query.get(reporte_id)
        reporte.estado = 'Resuelto'
        
        # Enviar notificación de reporte resuelto
        notification_title = "✅ Reporte confirmado"
        notification_body = f"El reporte '{reporte.titulo}' ha sido verificado por la comunidad"
        notification_data = {
            'tipo': 'reporte_confirmado',
            'reporte_id': reporte_id
        }
        send_push_notification(notification_title, notification_body, notification_data)
    
    db.session.commit()
    return jsonify({'msg': 'Reporte confirmado', 'confirmaciones': confirmaciones_count}), 200

@app.route('/estadisticas', methods=['GET'])
def obtener_estadisticas():
    total = Reporte.query.count()
    robos = Reporte.query.filter_by(tipo='Robo').count()
    extorsiones = Reporte.query.filter_by(tipo='Extorsión').count()
    sospechosos = Reporte.query.filter_by(tipo='Sospechoso').count()
    
    return jsonify({
        'total': total,
        'robos': robos,
        'extorsiones': extorsiones,
        'sospechosos': sospechosos
    })

@app.route('/reportes/<int:reporte_id>', methods=['GET'])
def obtener_reporte(reporte_id):
    reporte = Reporte.query.get_or_404(reporte_id)
    objetos = ObjetoSustraido.query.filter_by(reporte_id=reporte_id).all()
    sospechosos = Sospechoso.query.filter_by(reporte_id=reporte_id).all()
    confirmaciones = Confirmacion.query.filter_by(reporte_id=reporte_id).count()
    
    return jsonify({
        'id': reporte.id,
        'tipo': reporte.tipo,
        'titulo': reporte.titulo,
        'descripcion': reporte.descripcion,
        'direccion': reporte.direccion,
        'latitud': reporte.latitud,
        'longitud': reporte.longitud,
        'estado': reporte.estado,
        'fecha': reporte.fecha,
        'objetos': [obj.objeto for obj in objetos],
        'sospechosos': [{'nombre': s.nombre, 'descripcion': s.descripcion} for s in sospechosos],
        'confirmaciones': confirmaciones
    })

# Crear tablas al iniciar
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
