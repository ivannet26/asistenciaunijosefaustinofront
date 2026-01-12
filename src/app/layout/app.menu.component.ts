import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { PermisosxperfilService } from '../demo/service/permisosxperfil.service';
import { GlobalserviceService } from '../demo/service/globalservice.service';
import { ConfigService } from '../demo/service/config.service';

interface MenuItem{
    label: string;
    icon?:string;
    routerLink?: string[];
    items?: MenuItem[];
}

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})

export class AppMenuComponent implements OnInit {

    model: MenuItem[] = [];

    constructor(public layoutService: LayoutService, private pS: PermisosxperfilService,
        private gS:GlobalserviceService, private configService: ConfigService) { }

    ngOnInit() {
        this.loadMenu()
    }

    loadMenu(){
        const codigoPerfil=this.gS.getCodigoPerfil();
        const modulo = this.configService.getModuloEmpresa();

        this.pS.getPermisosPorPerfil(codigoPerfil,modulo).subscribe(response=>{
            if(response.isSuccess && response.data){
                this.model= this.buildMenuStructure(response.data);
            }
        })
    }

    private buildMenuStructure(permisos: any[]): MenuItem[] {
        const menuItems: MenuItem[] = [];
        const menuGroups = new Map<string, any>();

        // First, identify all menu groups (items with codigoFormulario ending in '0000')
        permisos.forEach(permiso => {
            if (permiso.codigoFormulario.endsWith('0000')) {
                menuGroups.set(permiso.codigoFormulario.substring(0, 2), {
                    label: permiso.etiqueta,
                    items: []
                });
            }
        });
        permisos.forEach(permiso => {
            if (!permiso.codigoFormulario.endsWith('0000')) {
                const groupPrefix = permiso.codigoFormulario.substring(0, 2);
                const group = menuGroups.get(groupPrefix);

                if (group) {
                    group.items.push({
                        label: permiso.etiqueta,
                        icon: this.getIconForFormulario(permiso.codigoFormulario),
                        routerLink: [this.getRouterLink(permiso.nombreFormulario)]
                    });
                }
            }
        });
        menuGroups.forEach(group => {
            if (group.items.length > 0) {
                menuItems.push(group);
            }
        });

        // forzar "Asistencia básica" dentro del grupo INTEGRACION 
        const integracion = menuItems.find(g => (g.label || '').toLowerCase() === 'integracion');
        
        if (integracion) {
            integracion.items = integracion.items || [];
            
            const existe = integracion.items.some(i =>
                i.routerLink?.[0] === 'asistenciareportebasico');
                
                if (!existe) {
                    integracion.items.push({
                        label: 'asistencia básica',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['asistenciareportebasico']
                    });
                }
            }


        return menuItems;
    }
        

    private getIconForFormulario(codigoFormulario: string): string {
        const iconMap: { [key: string]: string } = {
            '010100': 'pi pi-fw pi-book',
            '010200': 'pi pi-fw pi-server',
            '020100': 'pi pi-fw pi-user',
            '020200': 'pi pi-fw pi-users',
            '030100': 'pi pi-fw pi-calendar',
            '030200': 'pi pi-fw pi-calendar',
            // Add more mappings as needed
        };

        return iconMap[codigoFormulario] || 'pi pi-fw pi-cog';
    }

    private getRouterLink(nombreFormulario: string): string {
        // Remove 'frm' prefix and convert to kebab case
        return nombreFormulario
            .replace('frm', '')
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase();
    }

}
