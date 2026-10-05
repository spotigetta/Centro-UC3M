function truss_joints_animation
% Visual interactivo y animado del método de nudos (cercha triangular)
% A(0,0), C(L,0), B(L/2,h). Carga P (↓) en B.
% Apoyos: A (pivote Ax,Ay), C (rodillo Cy).
% Barras: 1-2 (AB), 2-3 (BC), 1-3 (AC)

    %% --- Parámetros iniciales ---
    L0 = 4;          % m
    h0 = 3;          % m
    P0 = 10;         % kN (hacia abajo)
    lw = 6;          % ancho de línea de barras

    % Estado (se guarda en struct para callbacks)
    S = struct('L',L0,'h',h0,'P',P0, ...
               'fig',[],'ax',[],'ui',struct(), ...
               'nodes',[],'bars',[],'gfx',struct(), ...
               'results',[]);

    %% --- Ventana y ejes ---
    S.fig = figure('Name','Método de nudos - Cercha triangular','Color','w',...
                   'NumberTitle','off','Position',[80 80 1100 650]);

    S.ax = axes('Parent',S.fig,'Position',[0.07 0.15 0.63 0.80]);
    hold(S.ax,'on'); axis(S.ax,'equal'); grid(S.ax,'on');
    xlabel(S.ax,'x [m]'); ylabel(S.ax,'y [m]');
    title(S.ax,'Cercha triangular — Método de nudos (A, B, C)');

    %% --- UI: sliders y botones ---
    S.ui.txtL = uicontrol(S.fig,'Style','text','String','L [m]', ...
        'Units','normalized','Position',[0.74 0.86 0.08 0.04], ...
        'BackgroundColor','w','HorizontalAlignment','left','FontWeight','bold');
    S.ui.slL = uicontrol(S.fig,'Style','slider','Min',2,'Max',10,'Value',L0, ...
        'Units','normalized','Position',[0.74 0.83 0.22 0.035], ...
        'Callback',@(src,~)onGeomChange('L',src.Value));

    S.ui.txth = uicontrol(S.fig,'Style','text','String','h [m]', ...
        'Units','normalized','Position',[0.74 0.78 0.08 0.04], ...
        'BackgroundColor','w','HorizontalAlignment','left','FontWeight','bold');
    S.ui.slh = uicontrol(S.fig,'Style','slider','Min',0.5,'Max',6,'Value',h0, ...
        'Units','normalized','Position',[0.74 0.75 0.22 0.035], ...
        'Callback',@(src,~)onGeomChange('h',src.Value));

    S.ui.txtP = uicontrol(S.fig,'Style','text','String','P [kN] (↓ en B)', ...
        'Units','normalized','Position',[0.74 0.70 0.18 0.04], ...
        'BackgroundColor','w','HorizontalAlignment','left','FontWeight','bold');
    S.ui.slP = uicontrol(S.fig,'Style','slider','Min',0,'Max',60,'Value',P0, ...
        'Units','normalized','Position',[0.74 0.67 0.22 0.035], ...
        'Callback',@(src,~)onGeomChange('P',src.Value));

    S.ui.btnSolve = uicontrol(S.fig,'Style','pushbutton','String','Calcular', ...
        'Units','normalized','Position',[0.74 0.60 0.22 0.06], ...
        'FontSize',12,'FontWeight','bold', ...
        'Callback',@(~,~)recompute(false));

    S.ui.btnAnim = uicontrol(S.fig,'Style','pushbutton','String','▶ Animar', ...
        'Units','normalized','Position',[0.74 0.51 0.22 0.06], ...
        'FontSize',12,'FontWeight','bold', ...
        'Callback',@(~,~)recompute(true));

    S.ui.txtInfo = uicontrol(S.fig,'Style','edit','Max',10,'Min',0, ...
        'Units','normalized','Position',[0.74 0.12 0.22 0.35], ...
        'HorizontalAlignment','left','BackgroundColor',[0.98 0.98 0.98], ...
        'String','', 'FontName','Consolas');

    % Guardar y dibujar por primera vez
    guidata(S.fig,S);
    recompute(false);

    %% --- Callbacks anidados ---
    function onGeomChange(field,val)
        S = guidata(gcf);
        switch field
            case 'L', S.L = val;
            case 'h', S.h = val;
            case 'P', S.P = val;
        end
        guidata(gcf,S);
        recompute(false);
    end

    function recompute(doAnimate)
        S = guidata(gcf);

        % Nodos
        A = [0, 0];
        C = [S.L, 0];
        B = [S.L/2, S.h];
        S.nodes = [A; B; C]; % 1:A, 2:B, 3:C

        % Barras (pares de índices de nodos)
        S.bars = [1 2; 2 3; 1 3]; % AB, BC, AC

        % Reacciones (equilibrio global)
        % Sum M_A = 0 -> Cy*L - P*(L/2) = 0 => Cy = P/2
        % Sum Fy = 0 -> Ay + Cy - P = 0 => Ay = P/2
        % Sum Fx = 0 -> Ax = 0
        P = S.P;
        Ax = 0;  Ay = P/2;  Cy = P/2;

        % Método de nudos
        % Nudo A: incógnitas TAB, TAC (tracción +)
        [lAB,mAB,LAB] = dircos(S.nodes(1,:), S.nodes(2,:));
        [lAC,mAC,LAC] = dircos(S.nodes(1,:), S.nodes(3,:));

        Aeq = [ lAB,  lAC;
                mAB,  mAC];
        beq = [-Ax; -Ay];
        TAB_TAC = Aeq\beq;
        TAB = TAB_TAC(1);  TAC = TAB_TAC(2);

        % Nudo C: incógnita TBC (tracción +) con Cy conocido y TAC ya hallado
        [lBC,mBC,LBC] = dircos(S.nodes(2,:), S.nodes(3,:));
        AeqC = [ lBC; mBC];           % 2x1
        beqC = [  TAC*lAC;  -Cy + TAC*mAC]; % pasar TAC al otro lado
        TBC = AeqC\beqC;

        % Resumen
        S.results = struct('Ax',Ax,'Ay',Ay,'Cy',Cy, ...
                           'TAB',TAB,'TBC',TBC,'TAC',TAC, ...
                           'L',[LAB LBC LAC], ...
                           'nodes',S.nodes);
        guidata(gcf,S);

        % Dibujar
        cla(S.ax);
        drawStructure();
        if doAnimate
            animateSolution();
        else
            paintResults();  % Colorear barras según N (+ tracción, - compresión)
            writeInfo();     % Texto de resultados
        end
    end

    function [l,m,L] = dircos(p1,p2)
        v = p2 - p1;  L = hypot(v(1),v(2));
        l = v(1)/L;   m = v(2)/L;
    end

    %% --- Dibujo de la estructura base (barras, nodos, apoyos y carga) ---
    function drawStructure()
        S = guidata(gcf);
        A = S.nodes(1,:); B = S.nodes(2,:); C = S.nodes(3,:);
        % Barras en gris claro (inicial)
        for k = 1:size(S.bars,1)
            i = S.bars(k,1); j = S.bars(k,2);
            p = S.nodes([i j],:);
            S.gfx.bar(k) = plot(S.ax,p(:,1),p(:,2),'-','Color',[0.7 0.7 0.7],...
                'LineWidth',lw);
        end
        % Nodos
        S.gfx.nodes = plot(S.ax,S.nodes(:,1),S.nodes(:,2),'ko','MarkerFaceColor','w','MarkerSize',7);
        text(A(1)-0.12,A(2)-0.12,'A','Parent',S.ax,'FontWeight','bold');
        text(B(1)+0.08,B(2)+0.08,'B','Parent',S.ax,'FontWeight','bold');
        text(C(1)+0.08,C(2)-0.12,'C','Parent',S.ax,'FontWeight','bold');

        % Apoyos (iconos simples)
        drawPin(A,0.18*S.L);          % Pivote en A
        drawRoller(C,0.18*S.L);       % Rodillo en C

        % Carga P (flecha hacia abajo en B)
        if S.P>0
            q = quiver(S.ax,B(1),B(2)+0.3,0,-0.5,0, ...
                'LineWidth',2,'Color',[0.85 0 0],'MaxHeadSize',2);
            text(B(1)+0.1,B(2)+0.25,sprintf('P=%.2f kN',S.P),'Color',[0.85 0 0],...
                'Parent',S.ax,'FontWeight','bold');
            S.gfx.load = q;
        end

        % Cuadros de escala y límites
        pad = 0.6 + 0.1*S.L;
        xlim(S.ax,[-pad, S.L+pad]); ylim(S.ax,[-0.7, max(0.7,S.h+0.9)]);
        guidata(gcf,S);
    end

    function drawPin(p,scale)
        % Triángulo + base
        S = guidata(gcf);
        b = 0.18*scale; h = 0.12*scale;
        X = p(1) + [-b 0 b]; Y = p(2) + [0 -h 0];
        fill(S.ax,X,Y,[0.2 0.2 0.2],'EdgeColor','none');
        line(S.ax,[p(1)-1.1*b p(1)+1.1*b],[p(2)-h p(2)-h],'Color',[0.2 0.2 0.2],'LineWidth',3);
    end

    function drawRoller(p,scale)
        % Triángulo + rueditas
        S = guidata(gcf);
        b = 0.18*scale; h = 0.12*scale;
        X = p(1) + [-b 0 b]; Y = p(2) + [0 -h 0];
        fill(S.ax,X,Y,[0.2 0.2 0.2],'EdgeColor','none');
        r = 0.04*scale;
        viscircles(S.ax,[p(1)-0.5*b p(2)-h-0.07*scale],r,'Color',[0.2 0.2 0.2],'LineWidth',2);
        viscircles(S.ax,[p(1)+0.5*b p(2)-h-0.07*scale],r,'Color',[0.2 0.2 0.2],'LineWidth',2);
        line(S.ax,[p(1)-1.1*b p(1)+1.1*b],[p(2)-h-0.12*scale p(2)-h-0.12*scale],...
             'Color',[0.2 0.2 0.2],'LineWidth',3);
    end

    %% --- Pintar resultados finales (color + etiquetas) ---
    function paintResults()
        S = guidata(gcf);
        % Colorear barras según N
        N = [S.results.TAB, S.results.TBC, S.results.TAC]; % AB BC AC
        for k=1:3
            if N(k) >= 0
                col = [0 0.35 0.9];  % tracción (azul)
            else
                col = [0.85 0 0];    % compresión (rojo)
            end
            set(S.gfx.bar(k),'Color',col,'LineWidth',lw + 2*min(6,abs(N(k))/5));
        end
        % Flechas de reacciones
        drawReaction(S.nodes(1,:), [0 S.results.Ay], 0.45, [0 0.5 0], 'A_y');
        drawReaction(S.nodes(1,:), [S.results.Ax 0], 0.45, [0 0.5 0], 'A_x');
        drawReaction(S.nodes(3,:), [0 S.results.Cy], 0.45, [0 0.5 0], 'C_y');

        % Etiquetas en el centro de cada barra
        mids = 0.5*(S.nodes(S.bars(:,1),:) + S.nodes(S.bars(:,2),:));
        lab  = {'AB','BC','AC'};
        for k=1:3
            text(mids(k,1),mids(k,2)+0.12, ...
                sprintf('%s: %.3f kN',lab{k},N(k)), ...
                'Parent',S.ax,'FontWeight','bold','Color',[0.2 0.2 0.2],...
                'HorizontalAlignment','center');
        end
        writeInfo();
        guidata(gcf,S);
    end

    function drawReaction(p,vec,scale,col,tag)
        S = guidata(gcf);
        if norm(vec)>0
            quiver(S.ax,p(1),p(2),scale*sign(vec(1)),scale*sign(vec(2)),0,...
                'Color',col,'LineWidth',2,'MaxHeadSize',2);
            text(p(1)+0.12*scale,p(2)+0.12*scale, ...
                sprintf('%s=%.3f',tag, vec(1)+vec(2)), ...
                'Color',col,'FontWeight','bold','Parent',S.ax);
        end
    end

    function writeInfo()
        S = guidata(gcf);
        R = S.results;
        txt = {
            '=== RESULTADOS (signo + = tracción, - = compresión) ==='
            sprintf('Ax = %7.3f kN', R.Ax)
            sprintf('Ay = %7.3f kN', R.Ay)
            sprintf('Cy = %7.3f kN', R.Cy)
            ' '
            sprintf('N_AB (TAB) = %7.3f kN', R.TAB)
            sprintf('N_BC (TBC) = %7.3f kN', R.TBC)
            sprintf('N_AC (TAC) = %7.3f kN', R.TAC)
            ' '
            sprintf('P = %.3f kN,  L = %.2f m,  h = %.2f m', S.P, S.L, S.h)
            ' '
            'Notas: rojo=compresión, azul=tracción.'
            'Se resuelve por nudos:'
            '- Reacciones globales (Ay=Cy=P/2, Ax=0)'
            '- Nudo A: incógnitas TAB, TAC'
            '- Nudo C: incógnita TBC'
            };
        set(S.ui.txtInfo,'String',txt);
    end

    %% --- Animación de pasos (reacciones -> nudo A -> nudo C -> resumen) ---
    function animateSolution()
        S = guidata(gcf);
        writeInfo();
        % Paso 1: Reacciones
        pauseStep(0.3);
        drawReaction(S.nodes(1,:), [0 S.results.Ay], 0.45, [0 0.5 0], 'A_y'); drawnow;
        pauseStep(0.3);
        drawReaction(S.nodes(3,:), [0 S.results.Cy], 0.45, [0 0.5 0], 'C_y'); drawnow;

        % Paso 2: Nudo A (resaltado)
        highlightNode(1); pauseStep(0.4);
        pulseBar(1,[0 0.35 0.9], S.results.TAB); pauseStep(0.3);
        pulseBar(3,[0 0.35 0.9], S.results.TAC); pauseStep(0.3);

        % Paso 3: Nudo C
        highlightNode(3); pauseStep(0.4);
        pulseBar(2,[0 0.35 0.9], S.results.TBC); pauseStep(0.3);

        % Paso 4: Resumen coloreado final
        cla(S.ax); drawStructure(); paintResults(); drawnow;
    end

    function pauseStep(t)
        drawnow; pause(t);
    end

    function highlightNode(idx)
        S = guidata(gcf);
        p = S.nodes(idx,:);
        plot(S.ax,p(1),p(2),'o','MarkerSize',18,'LineWidth',2, ...
            'MarkerEdgeColor',[0.1 0.6 0.1],'Color','none');
        nodesLabel = 'ABC';
        text(p(1)+0.12,p(2)+0.12,sprintf('Nudo %s', nodesLabel(idx)), ...
            'Parent',S.ax,'Color',[0.1 0.6 0.1],'FontWeight','bold');

        drawnow;
    end

    function pulseBar(k,baseColor,Nval)
        % Cambia el grosor y texto temporal con el valor de la fuerza
        S = guidata(gcf);
        p = S.nodes(S.bars(k,:),:);
        for a = linspace(0,1,10)
            set(S.gfx.bar(k),'Color',baseColor*(0.5+0.5*a),'LineWidth',lw + 6*a);
            drawnow; pause(0.04);
        end
        mid = mean(p,1);
        txt = text(mid(1),mid(2)+0.14,sprintf('N = %.3f kN',Nval), ...
            'Parent',S.ax,'Color',[0.2 0.2 0.2],'FontWeight','bold', ...
            'HorizontalAlignment','center');
        pause(0.3);
        delete(txt);
    end
end
