import{Component}from'@angular/core';import{CommonModule}from'@angular/common';import{RouterModule}from'@angular/router';import{MatCardModule}from'@angular/material/card';import{MatIconModule}from'@angular/material/icon';

const sidebar = `<div class="al"><div class="as"><div class="sh"><img src="assets/images/logo.png" class="sl"/><span>Admin</span></div><nav>
<a routerLink="/admin"><mat-icon>dashboard</mat-icon>Dashboard</a>
<a routerLink="/admin/users"><mat-icon>people</mat-icon>Người dùng</a>
<a routerLink="/admin/products"><mat-icon>inventory</mat-icon>Sản phẩm</a>
<a routerLink="/admin/policies"><mat-icon>description</mat-icon>Hợp đồng</a>
<a routerLink="/admin/claims"><mat-icon>assignment</mat-icon>Bồi thường</a>
<a routerLink="/admin/agents"><mat-icon>support_agent</mat-icon>Đại lý</a>
<a routerLink="/admin/partners"><mat-icon>handshake</mat-icon>Đối tác</a>
<a routerLink="/admin/reports"><mat-icon>bar_chart</mat-icon>Báo cáo</a>
<a routerLink="/admin/audit"><mat-icon>history</mat-icon>Audit Log</a>
<a routerLink="/admin/config"><mat-icon>settings</mat-icon>Cài đặt</a>
<a routerLink="/admin/monitoring" routerLinkActive="act"><mat-icon>monitor_heart</mat-icon>Monitoring</a></nav></div><div class="am">`;

@Component({selector:'app-monitoring',standalone:true,imports:[CommonModule,RouterModule,MatCardModule,MatIconModule],
template:sidebar+`<h2>System Monitoring</h2>
<div class="sg"><mat-card *ngFor="let s of svcs" class="sc" [class]="s.status">
<div class="sr"><mat-icon [style.color]="s.color">{{s.icon}}</mat-icon><div class="si"><h3>{{s.name}}</h3><p>{{s.desc}}</p></div>
<div class="ss"><span class="st" [class]="s.status">{{s.status==='ok'?'Healthy':'Warning'}}</span></div></div>
<div class="sm"><div *ngFor="let m of s.metrics" class="mi"><span>{{m.label}}</span><b>{{m.value}}</b></div></div>
</mat-card></div></div></div>`,
styles:[`
.al{display:flex;min-height:calc(100vh - 64px)}
.as{width:240px;background:#1a2332;color:#b0bec5;flex-shrink:0;padding:16px 0}
.sh{display:flex;align-items:center;gap:8px;padding:0 16px 16px;border-bottom:1px solid #2c3e50;.sl{height:28px}span{color:#fff;font-weight:700;font-size:15px}}
nav{padding:8px 0;a{display:flex;align-items:center;gap:10px;padding:10px 16px;color:#b0bec5;text-decoration:none;font-size:13px;transition:.2s;mat-icon{font-size:18px;width:18px;height:18px}&:hover{background:rgba(255,255,255,.05);color:#fff}&.act{background:rgba(21,101,192,.3);color:#42a5f5;border-left:3px solid #42a5f5}}}
.am{flex:1;padding:24px;background:#f5f7fa;overflow-y:auto;h2{font-size:24px;font-weight:700;margin-bottom:20px;color:#1a2332}}
.sg{display:grid;gap:14px}
.sc{padding:18px!important;border-radius:12px!important;&.ok{border-left:4px solid #4CAF50}&.warn{border-left:4px solid #FF9800}}
.sr{display:flex;align-items:center;gap:14px;margin-bottom:12px;mat-icon{font-size:28px;width:28px;height:28px}}
.si{flex:1;h3{font-size:14px;font-weight:600;margin:0}p{font-size:12px;color:#888;margin:0}}
.st{padding:3px 12px;border-radius:14px;font-size:11px;font-weight:600;&.ok{background:#e8f5e9;color:#2e7d32}&.warn{background:#fff3e0;color:#e65100}}
.sm{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;.mi{background:#f8fafc;padding:8px 12px;border-radius:6px;span{font-size:11px;color:#888;display:block}b{font-size:13px;color:#1a2332}}}
@media(max-width:768px){.as{display:none}}
`]})
export class MonitoringComponent{
  svcs=[
    {name:'API Gateway',desc:'Spring Cloud Gateway',icon:'api',color:'#4CAF50',status:'ok',metrics:[{label:'Uptime',value:'99.99%'},{label:'Requests/s',value:'1,250'},{label:'Avg Response',value:'45ms'},{label:'Error Rate',value:'0.02%'}]},
    {name:'PostgreSQL',desc:'Primary + Replica',icon:'storage',color:'#2196F3',status:'ok',metrics:[{label:'Connections',value:'128/500'},{label:'DB Size',value:'12.5 GB'},{label:'Queries/s',value:'850'},{label:'Replication Lag',value:'0.1ms'}]},
    {name:'Redis Cache',desc:'Session + Data Cache',icon:'memory',color:'#F44336',status:'ok',metrics:[{label:'Memory',value:'2.1/8 GB'},{label:'Hit Rate',value:'94.2%'},{label:'Keys',value:'45,200'},{label:'Connections',value:'32'}]},
    {name:'Kafka',desc:'3 Brokers, 15 Topics',icon:'flash_on',color:'#FF9800',status:'ok',metrics:[{label:'Messages/s',value:'3,500'},{label:'Consumer Lag',value:'12'},{label:'Partitions',value:'45'},{label:'Disk Usage',value:'28 GB'}]},
    {name:'Keycloak',desc:'SSO Authentication',icon:'security',color:'#9C27B0',status:'ok',metrics:[{label:'Active Sessions',value:'1,850'},{label:'Auth/min',value:'45'},{label:'Uptime',value:'99.98%'},{label:'MFA Rate',value:'72%'}]},
    {name:'ELK Stack',desc:'Elasticsearch + Logstash + Kibana',icon:'manage_search',color:'#795548',status:'warn',metrics:[{label:'Indices',value:'32'},{label:'Docs',value:'15.2M'},{label:'Disk',value:'85% ⚠️'},{label:'Query Latency',value:'120ms'}]}
  ];
}