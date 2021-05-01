
export function crearURL(slug:string) {
 
    // Reemplaza los carácteres especiales | simbolos con un espacio 
    slug = slug.replace(/['`'~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();
 
    // Corta los espacios al inicio y al final del sluging 
    slug = slug.replace(/^\s+|\s+$/gm, '');
 
    // Reemplaza el espacio con guión  
    slug = slug.replace(/\s+/g, '-'); 
 
    return slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
 
}
