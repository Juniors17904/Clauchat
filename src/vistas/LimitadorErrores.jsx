import { Component } from 'react';

export class LimitadorErrores extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[100svh] bg-[#0d1117] flex items-center justify-center px-6">
          <div className="bg-[#161b22] border border-[#f85149] rounded-xl p-6 w-full max-w-sm text-center">
            <p className="text-[#f85149] text-sm font-sans font-bold mb-2">Algo salió mal</p>
            <p className="text-[#8b949e] text-xs font-sans mb-4 break-words">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm rounded-lg font-sans transition-colors"
            >
              Recargar aplicación
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
