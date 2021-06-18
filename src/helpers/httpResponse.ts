/**
 * Enumeración HttpResponseCode
 * 
 * Codigos de respuesta HTTP estándar
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 */

export enum HttpResponse
{
    // Mensajes HTTP
    Ok              = 200,
    
    // Errores HTTP
    BadRequest      = 400,
    Unauthorized     = 401,
    Forbidden       = 403,
    NotFound        = 404
}
