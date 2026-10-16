import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  RENTABILIDAD_FONDOS,
  VALOR_CUOTA,
  COTIZANTES,
  MONTO_CUENTA_PROMEDIO,
  EDAD_JUBILACION,
} from "../data/afps";

const tooltipStyle = {
  backgroundColor: "#0a101f",
  border: "1px solid #1d293d",
  borderRadius: 6,
  fontSize: 12,
};

export function Panel({ title, subtitle, desc, children, height = 280 }) {
  return (
    <div className="panel">
      <div className="panel-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, width: "100%" }}>
          <div className="panel-title">{title}</div>
          {subtitle && <div className="panel-subtitle">{subtitle}</div>}
        </div>
        {desc && (
          <div style={{ fontSize: 12.5, color: "#a9b7cc", lineHeight: 1.45, marginTop: 2 }}>
            {desc}
          </div>
        )}
      </div>
      <div className="panel-body" style={{ minHeight: height }}>
        {children}
      </div>
    </div>
  );
}

export function RentabilidadFondosChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={RENTABILIDAD_FONDOS} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#243449" vertical={false} />
        <XAxis dataKey="anio" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={34} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#16161f" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="A" name="Fondo A (Más riesgo)" fill="#f87171" radius={[4, 4, 0, 0]} />
        <Bar dataKey="B" name="Fondo B" fill="#fb923c" radius={[4, 4, 0, 0]} />
        <Bar dataKey="C" name="Fondo C" fill="#fbbf24" radius={[4, 4, 0, 0]} />
        <Bar dataKey="D" name="Fondo D" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        <Bar dataKey="E" name="Fondo E (Menos riesgo)" fill="#34d399" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ValorCuotaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={VALOR_CUOTA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cuotaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fac800" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#fac800" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#243449" vertical={false} />
        <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={50}
          tickFormatter={(v) => `$${(v * 1000000).toFixed(2)}`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [`$${(v * 1000000).toFixed(4)}`, "Valor Cuota"]}
        />
        <Area
          type="monotone"
          dataKey="cuota"
          name="Valor Cuota"
          stroke="#fac800"
          strokeWidth={2.5}
          fill="url(#cuotaGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AfiliadosChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={COTIZANTES} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#243449" vertical={false} />
        <XAxis dataKey="anio" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={42}
          tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="afiliados"
          name="Afiliados"
          stroke="#60a5fa"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="cotizantes"
          name="Cotizantes"
          stroke="#00c758"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MontoCuentaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={MONTO_CUENTA_PROMEDIO} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#243449" vertical={false} />
        <XAxis dataKey="anio" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={42}
          tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [`$${v.toLocaleString("es-CL")}`, "Monto"]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="promedio"
          name="Saldo promedio"
          stroke="#fbbf24"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="mediana"
          name="Saldo mediana"
          stroke="#f87171"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const EDAD_COLORS = ["#f87171", "#fb923c", "#fbbf24", "#60a5fa", "#34d399"];

export function EdadJubilacionDonut() {
  const total = EDAD_JUBILACION.reduce((s, d) => s + d.monto, 0);
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 8 }}>
      <ResponsiveContainer width="55%" height="100%">
        <PieChart>
          <Pie
            data={EDAD_JUBILACION}
            dataKey="monto"
            nameKey="rango"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={3}
            stroke="#0a101f"
          >
            {EDAD_JUBILACION.map((_, i) => (
              <Cell key={i} fill={EDAD_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [`$${v.toLocaleString("es-CL")}`, "Pensión"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
        {EDAD_JUBILACION.map((d, i) => (
          <div key={d.rango} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 2,
                background: EDAD_COLORS[i],
                display: "inline-block",
              }}
            />
            <span style={{ color: "#94a3b8", flex: 1 }}>{d.rango} años</span>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
              ${(d.monto / 1000).toFixed(0)}k
            </span>
            <span style={{ color: "#64748b", width: 42, textAlign: "right" }}>
              {((d.monto / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
